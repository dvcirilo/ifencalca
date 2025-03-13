"use strict";

// Cálculo do produto escalar
const somaProduto = (a, b) => {
  return a.reduce((acc, cur, idx) => cur*b[idx] + acc, 0);
}

// Faz o cálculo da nota necessária pra 
// ser aprovado isolando por unidade.
// idx é o número da unidade - 1
const isolaNota = (idx, notas, pesos, notaMin) => {
  const somaPesos = pesos.reduce((acc,cur) => acc + cur, 0);
  return (somaPesos*notaMin - somaProduto(notas.toSpliced(idx,1), pesos.toSpliced(idx,1)))/pesos[idx];
}

const calcFinal = function (notas, pesos, notaMin) {
  // Calculo da média aritmética
  const somaPesos = pesos.reduce((acc,cur) => acc + cur, 0);
  const resultado = { "media": 0, "notaFinal": 0 };
  resultado.media = Math.round(somaProduto(notas, pesos)/somaPesos);

  if (resultado.media < notaMin) {
    // Calcula a nota substituída em cada unidade
    const novasNotas = notas.map((el, idx) =>
      isolaNota(idx, notas, pesos, notaMin)
    );
    console.log(novasNotas);
    // A nota necessária é a menor entre a substituição
    // em todas unidades ou a média aritmética
    resultado.notaFinal = Math.round(Math.min(...novasNotas, 2*notaMin-resultado.media));
  }
  return resultado;
}

document.getElementById("notaForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const notaMin = 60;
  const pesos = [2,2,3,3];
  const notas = [
    (parseFloat(document.getElementById("nota1").value) || 0),
    (parseFloat(document.getElementById("nota2").value) || 0),
    (parseFloat(document.getElementById("nota3").value) || 0),
    (parseFloat(document.getElementById("nota4").value) || 0)
  ];

  let mesgResultado = "";
  let resultado;

  if (isNaN(parseFloat(document.getElementById("nota4").value))) {
    resultado = isolaNota(3, notas, pesos, notaMin);
    mesgResultado = `📊 Você não forneceu a 4a nota.`;
    if (resultado > 100) {
      mesgResultado += `<br>⚠️ Você já está <strong>reprovado!</strong>`;
    } else {
      mesgResultado += `<br>⚠️ Você precisa de <strong>${resultado}</strong> na 4a nota para passar.`;
    }
  } else {
    resultado = calcFinal(notas, pesos, notaMin);
    console.log(resultado);
    mesgResultado = `📊 Sua média: <strong>${resultado.media}</strong>`;
    if (resultado.media < 60) {
      if (resultado.notaFinal > 100) {
        mesgResultado += `<br>⚠️ Você foi <strong>reprovado!</strong>`;
      } else {
        mesgResultado += `<br>⚠️ Você precisa de <strong>${resultado.notaFinal}</strong> na Prova Final para passar.`;
      }
    } else {
      mesgResultado += "<br>✅ Parabéns! Você foi aprovado.";
    }
  }

  document.getElementById("resultado").innerHTML = mesgResultado;
});
