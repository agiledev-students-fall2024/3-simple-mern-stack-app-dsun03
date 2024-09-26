import axios from 'axios';
import { useEffect, useState } from 'react';
import './Home.css'
/**
 * A React component that represents the Home page of the app.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const About = props => {
  
  const [aboutData, setAboutData] = useState({});
  const [error, setError] = useState('')

  useEffect(()=>{
    axios
    .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/aboutus`)
    .then(response=>{
      setAboutData(response.data.response)
    })
    .catch(err => {
      const errMsg = JSON.stringify(err, null, 2)
      setError(errMsg)
    })
  }, [])
  
  console.log(aboutData)

  return (
    <>
      <h1>{aboutData.name}</h1>
      <p>{aboutData.description}</p>
      <p>{aboutData.imageUrl}</p>
      <div><a href={aboutData.imageUrl}><img src={aboutData.imageUrl} alt = "A+ student"></img></a></div>
    </>
  )
}

// make this component available to be imported into any other file
export default About
