"use strict";

// Cálculo do produto escalar
const somaProduto = (a, b) => {
  return a.reduce((acc, cur, idx) => cur*b[idx] + acc, 0);
}

const somaPesos = (arr) => arr.reduce((acc,cur) => acc + cur, 0);

// Faz o cálculo da nota necessária pra 
// ser aprovado isolando por unidade.
// idx é o número da unidade - 1
const isolaNota = (idx, notas, pesos, notaMin) => {
  return Math.round((somaPesos(pesos)*notaMin - somaProduto(notas.toSpliced(idx,1), pesos.toSpliced(idx,1)))/pesos[idx]);
}

const calcFinal = function (notas, pesos, notaMin) {
  // Calculo da média aritmética
  const resultado = { "media": 0, "notaFinal": 0 };
  resultado.media = Math.round(somaProduto(notas, pesos)/somaPesos(pesos));

  if (resultado.media < notaMin) {
    // Calcula a nota substituída em cada unidade
    const novasNotas = notas.map((el, idx) =>
      isolaNota(idx, notas, pesos, notaMin)
    );
    // A nota necessária é a menor entre a substituição
    // em todas unidades ou a média aritmética
    const mediaArit = Math.round(2*notaMin-resultado.media);
    resultado.notaFinal = Math.min(...novasNotas, mediaArit);
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
    resultado = isolaNota(notaVazia, notas, pesos, notaMin);
    if (resultado > 100) {
      mesgResultado += `⛔ Você já está na <strong>prova final!</strong>`;
    } else {
      mesgResultado += `⚠️ Você precisa de <strong>${resultado}</strong> na ${notaVazia+1}ª nota para passar na média (${notaMin}).`;
    }
  } else {
    resultado = calcFinal(notas, pesos, notaMin);
    mesgResultado = `📊 Sua média: <strong>${resultado.media}</strong>`;
    if (resultado.media < 60) {
      if (resultado.notaFinal > 100) {
        mesgResultado += `<br>⛔ Você foi <strong>reprovado!</strong>`;
      } else {
        mesgResultado += `<br>⚠️ Você precisa de <strong>${resultado.notaFinal}</strong> na Prova Final para passar.`;
      }
    } else {
      mesgResultado += "<br>✅ Parabéns! Você foi aprovado.";
    }
  }
  document.getElementById("resultado").innerHTML = mesgResultado;
});
