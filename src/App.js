import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./components/loader";
import './app.css';

function App() {
  const [languange, setLanguage] = useState([]);
  const [loading,setLoading] = useState(false);
  const [inputLanguage, setInputLanguage] = useState("");
  const [outputLanguage, setOutputLanguage] = useState("");
  const [inputText, setInputText] = useState({
    value : ""
  });

  const [outputText, setOutputText] = useState("");
  const [isOutputText, setIsOutputText] = useState(false);

  function handleInputLanguage(event){
    const {value} = event.target;
    if(value === 'select a language'){
      setInputLanguage('');
    }else{
      setInputLanguage(value);
    }
  }

  function handleOutputLanguage(event){
    const {value} = event.target;
    if(value === 'select a language'){
      setOutputLanguage('');
    }else{
      setOutputLanguage(value);
    }
  }

  function handleInputText(event){
    const {value} = event.target;
    setInputText((prev)=>{
      return {
        ...prev,
        value : value
      }
    });
  }

  const encodedParams = new URLSearchParams();

  function handleTranslate(){
    setIsOutputText(true);
    encodedParams.append("q", inputText.value);
    encodedParams.append("target", outputLanguage.toLowerCase());
    encodedParams.append("source", inputLanguage.toLowerCase());

    const options = {
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': 'a7e6cc41edmshae1661fecffc869p157de2jsnb339a29e47a0',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
      },
      data: encodedParams
    };

    axios.request(options).then(function (response) {
    	let output = response.data;
      setOutputText(output.data.translations[0].translatedText);
      setIsOutputText(false);
    }).catch(function (error) {
    	console.error(error);
    });
  }

  useEffect(()=>{
    setLoading(true);
    const options = {
      method: 'GET',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/languages',
      headers: {
        'X-RapidAPI-Key': 'a7e6cc41edmshae1661fecffc869p157de2jsnb339a29e47a0',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
      }
    };

    axios.request(options).then( (response) => {
      let langData = response.data;
      setLanguage(langData.data.languages);
      setLoading(false);
    }).catch( (error) => {
      console.error(error);
    });

  },[]);

  return ( loading === true ? <Loader/> :<div className="App">
    
      <h1>Language translator 😎</h1>

      <div className="container">
        <div className="header">
          <span className="heading">From</span>
          <select name="languages" id="languages" onChange={handleInputLanguage}>
            <option value="select a language">--Select Language</option>
            {
              languange.map((card)=>{
                return <option value={card.language}>{card.language}</option>
              })
            }
          </select>
        </div>
        <div className="text">
          <textarea name="text_area" rows="10" value={inputText.value} onChange={handleInputText}  placeholder="type something here ---"></textarea>
        </div>
      </div>

      { isOutputText === true || (inputLanguage.length === 0 && outputLanguage.length === 0) ? null : <button onClick={handleTranslate}>Translate above text</button>}

      <div className="container">
        <div className="header">
          <span className="heading">To</span>
          <select name="languages" id="languages" onChange={handleOutputLanguage}>
          <option value="select a language">--Select Language</option>
            {
              languange.map((card)=>{
                return <option value={card.language}>{card.language}</option>
              })
            }
          </select>
        </div>
        <div className="text output">
          {isOutputText === true ? "loading..." : outputText}
        </div>
      </div>
      
    </div>
  );
}

export default App;
