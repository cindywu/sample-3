import HelloWorld from '../components/helloWorld'
import { useState, useRef } from 'react'

import { supabase } from '../lib/supabaseClient'
export default function Home({ neighborhoods }) {
  const [hoods, setHoods] = useState<any>(neighborhoods)
  const inputRef = useRef<HTMLInputElement>(null)

  async function fetchHoods() {
    try {
      const { data, error } = await supabase.from('neighborhoods').select()
      if (data) {
        setHoods(data)
      }
    } catch (error) {
      console.log({ error })
    } finally {
      console.log('hoods fetched')
    }
  }

  async function addNewHood() {
    try {
      const { error } = await supabase
        .from('neighborhoods')
        .insert({ name: inputRef.current.value })
    } catch (error) {
      console.log({ error })
    } finally {
      fetchHoods()
      inputRef.current.value = ''
    }
  }

  async function deleteHood(hoodID: number) {
    try {
      const { error } = await supabase
        .from('neighborhoods')
        .delete()
        .eq('id', hoodID)
    } catch (error) {
      console.log({ error })
    } finally {
      fetchHoods()
    }
  }

  return (
    <div>
      <HelloWorld />
      <ul className={'p-4 w-96'}>
        {hoods.map((hood) => (
          <li className={'flex justify-between'} key={hood.id}>
            <div>{hood.name}</div>
            <div
              className={'cursor-pointer hover:text-red-500'}
              onClick={() => deleteHood(hood.id)}
            >
              delete
            </div>
          </li>
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
