import HelloWorld from '../components/helloWorld'
import { useState, useRef, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'

import { supabase } from '../lib/supabaseClient'
export default function Home({ neighborhoods }) {
  const [hoods, setHoods] = useState<any>(neighborhoods)
  const inputRef = useRef<HTMLInputElement>(null)

  async function fetchHoods() {
    try {
      const { data, error } = await supabase.from('neighborhoods').select()
      if (data) {
        setHoods(data.sort((a, b) => a.id - b.id))
      }
    } catch (error) {
      console.log({ error })
    } finally {
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
    <div className={'flex flex-col pt-4 justify-center items-center'}>
      <div className={'w-screen flex flex-row'}>
        <div className={'grow'}></div>
        <div className={'pr-4'}>
          <UserButton />
        </div>
      </div>
      <HelloWorld />
      <ul className={'p-4 w-96'}>
        {hoods.map((hood: any) => (
          <Hood
            key={hood.id}
            hood={hood}
            handleDeleteHood={deleteHood}
            handleFetchHoods={fetchHoods}
          />
        ))}
      </ul>
      <div className={'p-4 flex flex-col w-96 bg-orange-200'}>
        <div className={'p-2'}>Add neighborhood</div>
        <input
          className={'p-2'}
          placeholder={'Enter neighborhood name'}
          ref={inputRef}
        ></input>{' '}
        <button
          className={'bg-orange-500 my-4 p-2 text-white hover:bg-orange-600'}
          onClick={() => addNewHood()}
        >
          Add Hood
        </button>
      </div>
    </div>
  )
}

type HoodProps = {
  hood: any
  handleDeleteHood: (hoodID: number) => void
  handleFetchHoods: any
}

function Hood({ hood, handleDeleteHood, handleFetchHoods }: HoodProps) {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [name, setName] = useState<string>(hood.name)

  async function updateHood() {
    try {
      const { error } = await supabase
        .from('neighborhoods')
        .update({ name })
        .eq('id', hood.id)
    } catch (error) {
      console.log({ error })
    } finally {
      handleFetchHoods()
    }
  }

  useEffect(() => {
    updateHood()
  }, [name])

  return (
    <li className={'flex justify-between'} key={hood.id}>
      {editMode ? (
        <input value={name} onChange={(e) => setName(e.target.value)} />
      ) : (
        <div onClick={() => setEditMode(true)}>{hood.name}</div>
      )}

      <div
        className={'cursor-pointer text-transparent hover:text-red-500'}
        onClick={() => handleDeleteHood(hood.id)}
      >
        Delete
      </div>
    </li>
  )
}

export async function getServerSideProps() {
  let { data } = await supabase.from('neighborhoods').select()

  return {
    props: {
      neighborhoods: data.sort((a, b) => a.id - b.id),
    },
  }
}
