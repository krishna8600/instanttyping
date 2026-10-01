const fs = require('fs');
const path = require('path');

const pages = [
  'index',
  '1-minute-typing-test', 
  '3-minute-typing-test', 
  'typing-test-for-beginners', 
  'numbers-punctuation-typing-test'
];
let enDict = JSON.parse(fs.readFileSync('src/i18n/en.json', 'utf8'));

pages.forEach(p => {
  const fp = 'src/pages/' + p + '.astro';
  let content = fs.readFileSync(fp, 'utf8');
  const shortP = p === 'index' ? 'idx' : p.split('-')[0];
  
  const headingRegex = /pageHeading=\"(.*?)\"/;
  const subRegex = /pageSubheading=\"(.*?)\"/;
  
  const headingMatch = content.match(headingRegex);
  const subMatch = content.match(subRegex);
  
  if (headingMatch && subMatch) {
     const hKey = `engine.${shortP}.heading`;
     const sKey = `engine.${shortP}.subheading`;
     enDict[hKey] = headingMatch[1];
     enDict[sKey] = subMatch[1];
     
     content = content.replace(headingRegex, `pageHeading="${headingMatch[1]}" pageHeadingKey="${hKey}"`);
     content = content.replace(subRegex, `pageSubheading="${subMatch[1]}" pageSubheadingKey="${sKey}"`);
     
     fs.writeFileSync(fp, content);
  }
});

fs.writeFileSync('src/i18n/en.json', JSON.stringify(enDict, null, 2));

// Add actual translations for index.astro strings
const frDict = JSON.parse(fs.readFileSync('src/i18n/fr.json', 'utf8'));
frDict['engine.idx.heading'] = 'Instant Typing : Test de Vitesse et de Précision';
frDict['engine.idx.subheading'] = 'Testez la vitesse de votre clavier avec le MPM en temps réel, le suivi précis des erreurs et la correction d\'exercices personnalisés.';
fs.writeFileSync('src/i18n/fr.json', JSON.stringify(frDict, null, 2));

const esDict = JSON.parse(fs.readFileSync('src/i18n/es.json', 'utf8'));
esDict['engine.idx.heading'] = 'Instant Typing: Prueba de Velocidad y Precisión';
esDict['engine.idx.subheading'] = 'Pon a prueba la velocidad de tu teclado con PPM en tiempo real, seguimiento preciso de errores y corrección de ejercicios personalizados.';
fs.writeFileSync('src/i18n/es.json', JSON.stringify(esDict, null, 2));

const jaDict = JSON.parse(fs.readFileSync('src/i18n/ja.json', 'utf8'));
jaDict['engine.idx.heading'] = 'Instant Typing: 速度と精度のテスト';
jaDict['engine.idx.subheading'] = 'リアルタイムのWPM、正確なエラートラッキング、カスタマイズされたドリルの修復でキーボードの速度をテストします。';
fs.writeFileSync('src/i18n/ja.json', JSON.stringify(jaDict, null, 2));

const deDict = JSON.parse(fs.readFileSync('src/i18n/de.json', 'utf8'));
deDict['engine.idx.heading'] = 'Instant Typing: Geschwindigkeits- und Genauigkeitstest';
deDict['engine.idx.subheading'] = 'Testen Sie Ihre Tastaturgeschwindigkeit mit Echtzeit-WPM, präziser Fehlerverfolgung und maßgeschneiderter Übungsbehebung.';
fs.writeFileSync('src/i18n/de.json', JSON.stringify(deDict, null, 2));

const ptDict = JSON.parse(fs.readFileSync('src/i18n/pt.json', 'utf8'));
ptDict['engine.idx.heading'] = 'Instant Typing: Teste de Velocidade e Precisão';
ptDict['engine.idx.subheading'] = 'Teste a velocidade do seu teclado com PPM em tempo real, rastreamento preciso de erros e correção de exercícios personalizados.';
fs.writeFileSync('src/i18n/pt.json', JSON.stringify(ptDict, null, 2));

const koDict = JSON.parse(fs.readFileSync('src/i18n/ko.json', 'utf8'));
koDict['engine.idx.heading'] = 'Instant Typing: 속도 및 정확도 테스트';
koDict['engine.idx.subheading'] = '실시간 WPM, 정밀한 오타 추적, 맞춤형 훈련을 통해 키보드 속도를 테스트하세요.';
fs.writeFileSync('src/i18n/ko.json', JSON.stringify(koDict, null, 2));

const itDict = JSON.parse(fs.readFileSync('src/i18n/it.json', 'utf8'));
itDict['engine.idx.heading'] = 'Instant Typing: Test di Velocità e Precisione';
itDict['engine.idx.subheading'] = 'Metti alla prova la velocità della tua tastiera con WPM in tempo reale, tracciamento accurato degli errori e correzione con esercizi personalizzati.';
fs.writeFileSync('src/i18n/it.json', JSON.stringify(itDict, null, 2));

// Fallback all others
const locales = ['es', 'ja', 'fr', 'de', 'pt', 'ko', 'it'];
locales.forEach(l => {
  const file = path.join('src/i18n', l + '.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.keys(enDict).forEach(k => {
     if (!data[k]) data[k] = enDict[k]; 
  });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});
console.log('Heading properties wired up.');
