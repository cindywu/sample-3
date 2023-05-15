import HelloWorld from '../components/helloWorld'
import { useState, useRef, useEffect } from 'react'

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
    <div>
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
        className={'cursor-pointer hover:text-red-500'}
        onClick={() => handleDeleteHood(hood.id)}
      >
        delete
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
