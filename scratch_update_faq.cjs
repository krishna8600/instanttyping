const fs = require('fs');
const path = require('path');

const dict = {
  en: {
    'faq.idx.title': 'Frequently Asked Questions About Typing Tests',
    'faq.idx.q1': 'How is Words Per Minute (WPM) calculated on Instant Typing?',
    'faq.idx.a1': 'Following standard international typing measurement guidelines, one word is defined as exactly five keystrokes (including letters, spaces, and punctuation). Net WPM is calculated as: (Correct Keystrokes / 5) divided by the time elapsed in minutes. This ensures an objective and standardized measurement regardless of vocabulary complexity.',
    'faq.idx.q2': 'What is considered an average typing speed?',
    'faq.idx.a2': 'The average global typing speed is approximately 40 words per minute (WPM). Professional typists, transcriptionists, and legal secretaries typically type between 65 and 85 WPM, while high-speed competitive typists achieve speeds upwards of 100 to 120+ WPM with 98% accuracy.',
    'faq.idx.q3': 'What is the difference between Raw WPM and Net WPM?',
    'faq.idx.a3': 'Raw WPM (Gross WPM) represents the total number of keystrokes typed divided by 5 per minute, regardless of whether characters were correct or incorrect. Net WPM only counts correctly typed characters. Net WPM is the true metric used in professional assessments because typos decrease productivity.',
    'faq.idx.q4': 'How does the \'Train My Mistakes\' feature work?',
    'faq.idx.a4': 'Whenever you complete a test with errors, our engine analyzes your exact keystroke log and isolates the words and keys that triggered typos. Clicking \'Train My Mistakes\' automatically generates a targeted practice drill focusing strictly on your problem areas so you improve where it counts.',
    'faq.idx.q5': 'Can I download or share a typing certificate?',
    'faq.idx.a5': 'Yes. After completing any test, click \'View Skill Certificate\'. The engine renders a high-resolution performance certificate complete with your Net WPM, Accuracy, and Consistency. You can download this PNG certificate directly for resumes, portfolios, or job applications.'
  },
  fr: {
    'faq.idx.title': 'Foire aux questions sur les tests de frappe',
    'faq.idx.q1': 'Comment les mots par minute (MPM) sont-ils calculés sur Instant Typing ?',
    'faq.idx.a1': 'Suivant les directives internationales standard de mesure de la frappe, un mot est défini comme exactement cinq frappes. Le MPM net est calculé comme : (Frappes correctes / 5) divisé par le temps écoulé en minutes.',
    'faq.idx.q2': 'Quelle est la vitesse de frappe moyenne ?',
    'faq.idx.a2': 'La vitesse de frappe moyenne mondiale est d\'environ 40 MPM. Les professionnels tapent généralement entre 65 et 85 MPM, tandis que les dactylographes de compétition atteignent plus de 100 à 120 MPM.',
    'faq.idx.q3': 'Quelle est la différence entre le MPM brut et le MPM net ?',
    'faq.idx.a3': 'Le MPM brut représente le nombre total de frappes divisé par 5 par minute, qu\'elles soient correctes ou non. Le MPM net ne compte que les caractères correctement tapés.',
    'faq.idx.q4': 'Comment fonctionne la fonctionnalité \'Entraîner mes erreurs\' ?',
    'faq.idx.a4': 'Lorsque vous terminez un test avec des erreurs, notre moteur isole les mots qui ont déclenché des fautes de frappe et génère un exercice ciblé.',
    'faq.idx.q5': 'Puis-je télécharger un certificat de dactylographie ?',
    'faq.idx.a5': 'Oui. Après avoir terminé un test, cliquez sur \'Voir le certificat de compétence\'. Vous pouvez télécharger ce certificat pour vos CV ou portfolios.'
  },
  es: {
    'faq.idx.title': 'Preguntas frecuentes sobre las pruebas de mecanografía',
    'faq.idx.q1': '¿Cómo se calculan las palabras por minuto (PPM)?',
    'faq.idx.a1': 'Siguiendo las pautas internacionales estándar, una palabra se define como exactamente cinco pulsaciones. Las PPM netas se calculan como: (Pulsaciones correctas / 5) dividido por el tiempo en minutos.',
    'faq.idx.q2': '¿Cuál se considera una velocidad de escritura promedio?',
    'faq.idx.a2': 'La velocidad promedio global es de aproximadamente 40 PPM. Los profesionales escriben entre 65 y 85 PPM, mientras que los competidores alcanzan más de 100 a 120 PPM.',
    'faq.idx.q3': '¿Cuál es la diferencia entre PPM brutas y PPM netas?',
    'faq.idx.a3': 'Las PPM brutas representan el número total de pulsaciones dividido por 5 por minuto. Las PPM netas solo cuentan los caracteres escritos correctamente.',
    'faq.idx.q4': '¿Cómo funciona la función \'Entrenar mis errores\'?',
    'faq.idx.a4': 'Analiza su registro de pulsaciones y aísla las palabras que desencadenaron errores de escritura para generar un ejercicio enfocado.',
    'faq.idx.q5': '¿Puedo descargar un certificado de mecanografía?',
    'faq.idx.a5': 'Sí. Después de completar una prueba, puede descargar un certificado PNG con sus resultados.'
  },
  ja: {
    'faq.idx.title': 'タイピングテストに関するよくある質問',
    'faq.idx.q1': '1分あたりの単語数（WPM）はどのように計算されますか？',
    'faq.idx.a1': '国際的な標準測定ガイドラインに従い、1単語は正確に5キーストロークとして定義されます。正味WPMは（正しいキーストローク / 5）を分で割って計算されます。',
    'faq.idx.q2': '平均的なタイピング速度はどれくらいですか？',
    'faq.idx.a2': '世界の平均タイピング速度は約40WPMです。専門家は通常65から85WPMで入力します。',
    'faq.idx.q3': '粗WPMと正味WPMの違いは何ですか？',
    'faq.idx.a3': '粗WPMは正誤に関わらず入力された総キーストローク数を5で割ったものです。正味WPMは正しく入力された文字のみをカウントします。',
    'faq.idx.q4': '「間違いを訓練する」機能はどのように機能しますか？',
    'faq.idx.a4': 'エラーを分析し、タイプミスを引き起こした単語を分離して、集中的な練習ドリルを生成します。',
    'faq.idx.q5': 'タイピング証明書をダウンロードできますか？',
    'faq.idx.a5': 'はい。テスト完了後に証明書をダウンロードして共有できます。'
  },
  de: {
    'faq.idx.title': 'Häufig gestellte Fragen zu Tipptests',
    'faq.idx.q1': 'Wie werden Wörter pro Minute (WPM) berechnet?',
    'faq.idx.a1': 'Nach internationalen Standardrichtlinien wird ein Wort als genau fünf Tastenanschläge definiert. Netto-WPM ist: (Richtige Anschläge / 5) geteilt durch Minuten.',
    'faq.idx.q2': 'Was gilt als durchschnittliche Tippgeschwindigkeit?',
    'faq.idx.a2': 'Die durchschnittliche globale Geschwindigkeit beträgt ca. 40 WPM. Profis tippen zwischen 65 und 85 WPM.',
    'faq.idx.q3': 'Was ist der Unterschied zwischen Brutto- und Netto-WPM?',
    'faq.idx.a3': 'Brutto-WPM zählt alle Tastenanschläge. Netto-WPM zählt nur korrekt getippte Zeichen.',
    'faq.idx.q4': 'Wie funktioniert die Funktion \'Meine Fehler trainieren\'?',
    'faq.idx.a4': 'Sie analysiert Fehler und generiert eine gezielte Übung mit den Wörtern, bei denen Sie Tippfehler gemacht haben.',
    'faq.idx.q5': 'Kann ich ein Zertifikat herunterladen?',
    'faq.idx.a5': 'Ja, nach jedem Test können Sie ein offizielles Zertifikat herunterladen.'
  },
  pt: {
    'faq.idx.title': 'Perguntas frequentes sobre testes de digitação',
    'faq.idx.q1': 'Como as Palavras Por Minuto (PPM) são calculadas?',
    'faq.idx.a1': 'Seguindo as diretrizes internacionais, uma palavra é definida como exatamente cinco toques. PPM líquido é calculado como: (Toques corretos / 5) dividido pelos minutos.',
    'faq.idx.q2': 'Qual é a velocidade média de digitação?',
    'faq.idx.a2': 'A velocidade média global é de cerca de 40 PPM. Profissionais digitam entre 65 e 85 PPM.',
    'faq.idx.q3': 'Qual é a diferença entre PPM bruto e líquido?',
    'faq.idx.a3': 'PPM bruto representa o total de toques. PPM líquido conta apenas os caracteres digitados corretamente.',
    'faq.idx.q4': 'Como funciona o recurso \'Treinar meus erros\'?',
    'faq.idx.a4': 'Ele analisa seus erros e gera um exercício direcionado com as palavras que você errou.',
    'faq.idx.q5': 'Posso baixar um certificado?',
    'faq.idx.a5': 'Sim, você pode baixar um certificado PNG oficial após qualquer teste.'
  },
  ko: {
    'faq.idx.title': '타자 테스트에 대한 자주 묻는 질문',
    'faq.idx.q1': '분당 단어 수(WPM)는 어떻게 계산되나요?',
    'faq.idx.a1': '국제 표준 지침에 따라 한 단어는 정확히 5번의 키 입력으로 정의됩니다. 순 WPM은 (올바른 키 입력 / 5)를 분으로 나누어 계산합니다.',
    'faq.idx.q2': '평균 타자 속도는 얼마인가요?',
    'faq.idx.a2': '전 세계 평균 속도는 약 40 WPM입니다. 전문가는 보통 65에서 85 WPM으로 타자를 칩니다.',
    'faq.idx.q3': '총 WPM과 순 WPM의 차이는 무엇인가요?',
    'faq.idx.a3': '총 WPM은 모든 키 입력을 포함하며, 순 WPM은 올바르게 입력된 문자만 계산합니다.',
    'faq.idx.q4': '\'내 실수 훈련하기\' 기능은 어떻게 작동하나요?',
    'faq.idx.a4': '오타가 난 단어를 분석하여 집중적인 연습 드릴을 생성합니다.',
    'faq.idx.q5': '증명서를 다운로드할 수 있나요?',
    'faq.idx.a5': '네, 테스트 완료 후 인증서를 다운로드할 수 있습니다.'
  },
  it: {
    'faq.idx.title': 'Domande frequenti sui test di battitura',
    'faq.idx.q1': 'Come vengono calcolate le parole al minuto (WPM)?',
    'faq.idx.a1': 'Secondo le linee guida standard, una parola è definita come esattamente cinque battute. Il WPM netto è calcolato come: (Battute corrette / 5) diviso per i minuti.',
    'faq.idx.q2': 'Qual è una velocità di battitura media?',
    'faq.idx.a2': 'La velocità media globale è di circa 40 WPM. I professionisti digitano tra 65 e 85 WPM.',
    'faq.idx.q3': 'Qual è la differenza tra WPM lordo e netto?',
    'faq.idx.a3': 'Il WPM lordo rappresenta il totale delle battute. Il WPM netto conta solo i caratteri digitati correttamente.',
    'faq.idx.q4': 'Come funziona la funzione \'Allena i miei errori\'?',
    'faq.idx.a4': 'Analizza i tuoi errori e genera un esercizio mirato con le parole sbagliate.',
    'faq.idx.q5': 'Posso scaricare un certificato?',
    'faq.idx.a5': 'Sì, puoi scaricare un certificato ufficiale dopo qualsiasi test.'
  }
};

const locales = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it'];
locales.forEach(l => {
  const file = path.join('src/i18n', l + '.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(data, dict[l]);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});
console.log('FAQ dictionaries updated.');
