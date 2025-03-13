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
  return Math.round((somaPesos*notaMin - somaProduto(notas.toSpliced(idx,1), pesos.toSpliced(idx,1)))/pesos[idx]);
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
    parseFloat(document.getElementById("nota1").value),
    parseFloat(document.getElementById("nota2").value),
    parseFloat(document.getElementById("nota3").value),
    parseFloat(document.getElementById("nota4").value)
  ];

  let mesgResultado = "";
  let resultado;

  const notasVazias = notas.map((el, idx) => isNaN(el));
  if (notasVazias.filter((el) => el).length > 1) {
    mesgResultado = `⛔ Você precisa fornecer pelo menos 3 notas!`;
  } else if (notasVazias.filter((el) => el).length === 1) {
    const notaVazia = notasVazias.indexOf(true);
    mesgResultado = `📊 Você não forneceu a ${notaVazia+1}ª nota.`;
    resultado = Math.round(isolaNota(notaVazia, notas, pesos, notaMin));
    if (resultado > 100) {
      mesgResultado += `<br>⛔ Você já está na <strong>prova final!</strong>`;
    } else {
      mesgResultado += `<br>⚠️ Você precisa de <strong>${resultado}</strong> na ${notaVazia+1}ª nota para passar na média (${notaMin}).`;
    }
  } else {
    resultado = calcFinal(notas, pesos, notaMin);
    mesgResultado = `📊 Sua média: <strong>${Math.round(resultado.media)}</strong>`;
    if (resultado.media < 60) {
      if (resultado.notaFinal > 100) {
        mesgResultado += `<br>⛔ Você foi <strong>reprovado!</strong>`;
      } else {
        mesgResultado += `<br>⚠️ Você precisa de <strong>${Math.round(resultado.notaFinal)}</strong> na Prova Final para passar.`;
      }
    } else {
      mesgResultado += "<br>✅ Parabéns! Você foi aprovado.";
    }
  }
  document.getElementById("resultado").innerHTML = mesgResultado;
});