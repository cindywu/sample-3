import HelloWorld from '../components/helloWorld'
import { useState, useEffect, useRef } from 'react'

import { supabase } from '../lib/supabaseClient'
export default function Home({ neighborhoods }) {
  const inputRef = useRef<HTMLInputElement>(null)

  async function addNewHood() {
    try {
      // create new neighborhood in db
      const { error } = await supabase
        .from('neighborhoods')
        .insert({ name: inputRef.current.value }) // can we get away without including an id
    } catch (error) {
      console.log({ error })
    } finally {
      alert('thing did a thing!')
    }
  }

  return (
    <div>
      <HelloWorld />
      <ul className={'p-4'}>
        {neighborhoods.map((hood) => (
          <li key={hood.id}>{hood.name}</li>
        ))}
      </ul>
      <div className={'p-4 flex flex-col w-96 bg-orange-200'}>
        <div>new hood</div>
        <input placeholder={'type new hood'} ref={inputRef}></input>{' '}
        <button
          className={'bg-orange-500 my-4 hover:bg-orange-600'}
          onClick={() => addNewHood()}
        >
          add hood
        </button>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  let { data } = await supabase.from('neighborhoods').select()

  return {
    props: {
      neighborhoods: data,
    },
  }
}
