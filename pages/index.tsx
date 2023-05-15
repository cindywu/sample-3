import HelloWorld from '../components/helloWorld'

import { supabase } from '../lib/supabaseClient'
export default function Home({ neighborhoods }) {
  return (
    <div>
      <HelloWorld />
      <ul className={'p-4'}>
        {neighborhoods.map((hood) => (
          <li key={hood.id}>{hood.name}</li>
        ))}
      </ul>
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
