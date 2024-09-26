import axios from 'axios';
import { useEffect, useState } from 'react';
import './About.css'
/**
 * A React component that represents the Home page of the app.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const About = props => {
  
  const [aboutData, setAboutData] = useState({});

  useEffect(()=>{
    //fetch the info from the backend
    axios
    .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/aboutus`)
    //get the response data
    .then(response=>{
      setAboutData(response.data.response)
    })
    .catch(err => {
      console.error('Error fetching about data:', err);
    })
  }, [])
  
  return (
    <>
      <h1>{aboutData.name}</h1>
      <div 
        className="paragraph-container"
        //apply the newline breaks
        dangerouslySetInnerHTML={{
            __html: aboutData?.description?.replace(/\n/g, '<br />')
        }} 
    />
      <div><a href={aboutData.imageUrl}><img src={aboutData.imageUrl} alt = "A+ student"></img></a></div>
    </>
  )
}

// make this component available to be imported into any other file
export default About
