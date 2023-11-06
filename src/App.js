import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import nums from './initialArray';

function App() {
  const [realNum, setRealNum] = useState(nums);
  const [fullNum, setFullNum] = useState([]);
  const [numVis, setNumVis] = useState("hidden");
  const [numSelec, setNumSelec] = useState(0);
  const [nameSelec, setNameSelec] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [winNum, setWinNum] = useState({ id: 1, name: null });
  const [winVis, setWinVis] = useState("hidden");
  async function writeData() {
    const name = prompt("Digite o nome do comprador");
    if (name) await axios.post('http://localhost:3001/numbers', { number: numSelec, name: name });
    setFeedback("Guardado");
    window.location.reload();
  }
  async function updateData() {
    const name = prompt("Digite o novo nome");
    if (name) await axios.put(`http://localhost:3001/numbers/${numSelec}`, { name: name });
    setFeedback("Atualizado");
    window.location.reload();
  }
  async function deleteData() {
    await axios.delete(`http://localhost:3001/numbers/${numSelec}`);
    setFeedback("Excluido");
    window.location.reload();
  }
  async function sendMsg() {
    if (nameSelec) {
      navigator.clipboard.writeText(`Olá ${nameSelec}!\n\nSeu número é o ${numSelec}.\n\nBoa sorte!`);
      setFeedback("Copiado");
    } else {
      setFeedback("Sem Registro");
    }
  }
  async function randomSort() {
    const rand = Math.floor(Math.random() * (fullNum.length - 1) + 1);
    let winner = { name: null};
    while(!winner.name) {
      winner = fullNum[rand - 1];
    }
    setWinNum(winner);
    setWinVis("visible");
  }
  React.useEffect(() => {
    async function getData() {
      const response = await axios.get('http://localhost:3001/numbers');
      const newNum = realNum;
      setFullNum(response.data);
      if(response.data) {
        response.data.forEach(peopple => {
          newNum[peopple.id - 1].name = peopple.name;
        });
        setRealNum(newNum);
      }
    }

    getData();
  }, [realNum]);
  return (
    <div className="App">
      <main className="App-header">
        <div className="numbersGrid">
          {realNum.map((num) => (
            <div
              key={num.id}
              className={(num.name) ? ("numCard colorGreen") : ("numCard")}
              onClick={() => {
                setNumSelec(num.id);
                setNameSelec(num.name);
                setNumVis("visible");
              }}
            >
              <p>{num.id}</p>
            </div>
          ))}
        </div>
        <button className="randBtn" onClick={randomSort}>Sortear</button>
        <div className="wrapper" style={{ visibility: numVis }}>
          <div className="numPopup">
            <h1
              className="exit"
              onClick={() => {
                setFeedback("");
                setNumVis("hidden");
              }}
            >
              ⊠
            </h1>
            <h1>{numSelec} - {(nameSelec) ? (nameSelec) : ("Vazio")}</h1>
            <div className="optionsGrid">
              {
                (nameSelec) ?
                (<button className="update" onClick={updateData}>✏️</button>) :
                (<button className="store" onClick={writeData}>💾</button>)
              }
              <button
                className="delete"
                onClick={() => {
                  if(nameSelec) {
                    setFeedback("");
                    deleteData();
                  } else {
                    setFeedback("Registro não existe");
                  }
                }}
              >
                🗑️
              </button>
              <button className="message" onClick={sendMsg}>📧</button>
            </div>
            <h2>{feedback}</h2>
          </div>
        </div>
        <div className="wrapper" style={{ visibility: winVis }}>
          <div className="winPopup">
            <h1
              className="exit"
              onClick={() => {
                setFeedback("");
                setWinVis("hidden");
              }}
            >
              ⊠
            </h1>
            <h1>{winNum.id} - {winNum.name}</h1>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
