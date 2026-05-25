/* ============================================================
   DATA — drawn directly from Silvia Salinas Mulder's CV
   ============================================================ */
window.DOSSIER = (function(){

  // Field sites on a 1000x500 equirectangular projection
  const COUNTRIES = {
    Bolivia:{x:315,y:340,r:"LAC"}, Colombia:{x:295,y:285,r:"LAC"}, Ecuador:{x:283,y:300,r:"LAC"},
    Peru:{x:295,y:325,r:"LAC"}, Mexico:{x:215,y:240,r:"LAC"}, Guatemala:{x:228,y:262,r:"LAC"},
    Nicaragua:{x:240,y:268,r:"LAC"}, Guyana:{x:330,y:288,r:"LAC"}, Jamaica:{x:268,y:258,r:"LAC"},
    Bangladesh:{x:715,y:268,r:"Asia-Pacific"}, Thailand:{x:735,y:285,r:"Asia-Pacific"},
    Vietnam:{x:750,y:285,r:"Asia-Pacific"}, Azerbaijan:{x:615,y:230,r:"E. Europe & MENA"},
    Ukraine:{x:560,y:210,r:"E. Europe & MENA"}, Lebanon:{x:580,y:248,r:"E. Europe & MENA"},
    Syria:{x:588,y:248,r:"E. Europe & MENA"}
  };
  const REGIONS=["LAC","Asia-Pacific","E. Europe & MENA"];

  // Practice areas (Entry 02, horizontal scroll)
  const PRACTICE=[
    {idx:"01",tag:{en:"Method",es:"Método"},title:{en:"Theory-based <em>Evaluation</em>",es:"Evaluación <em>basada en teoría</em>"},
     body:{en:"Mixed-methods, utilization-focused designs that hold up under scrutiny — built to inform decisions, not decorate reports.",es:"Diseños de métodos mixtos orientados al uso que resisten el escrutinio — construidos para informar decisiones, no para decorar informes."},
     pts:{en:["Theory of Change development & refinement","Contribution analysis","Assessment of complex, intangible change"],es:["Desarrollo y refinamiento de Teoría del Cambio","Análisis de contribución","Evaluación de cambios complejos e intangibles"]}},
    {idx:"02",tag:{en:"Systems",es:"Sistemas"},title:{en:"Multi-country & <em>Networked</em> Work",es:"Trabajo multipaís y <em>en red</em>"},
     body:{en:"Evaluating initiatives that span borders, institutions and levels of influence — governance, policy and organisational learning.",es:"Evaluando iniciativas que cruzan fronteras, instituciones y niveles de influencia — gobernanza, política y aprendizaje organizacional."},
     pts:{en:["Multi-stakeholder & networked initiatives","Policy influence & systems change","Organisational learning across regions"],es:["Iniciativas multiactor y en red","Influencia política y cambio sistémico","Aprendizaje organizacional entre regiones"]}},
    {idx:"03",tag:{en:"Lens",es:"Enfoque"},title:{en:"Gender, Rights & <em>Intersectionality</em>",es:"Género, Derechos e <em>Interseccionalidad</em>"},
     body:{en:"Rights-based, intersectional analysis attentive to power, inclusion and the people most often left out of the data.",es:"Análisis interseccional basado en derechos, atento al poder, la inclusión y las personas más excluidas de los datos."},
     pts:{en:["SRHR, adolescents & youth participation","GBV prevention & response","Inclusion, diversity & power relations"],es:["SDSR, adolescentes y participación juvenil","Prevención y respuesta a la VBG","Inclusión, diversidad y relaciones de poder"]}},
    {idx:"04",tag:{en:"Craft",es:"Oficio"},title:{en:"Facilitation & <em>Learning</em>",es:"Facilitación y <em>Aprendizaje</em>"},
     body:{en:"Turning evidence into shared understanding — sense-making, validation and co-created recommendations across cultures.",es:"Convirtiendo la evidencia en entendimiento compartido — análisis, validación y recomendaciones co-creadas entre culturas."},
     pts:{en:["Sense-making & validation workshops","Multicultural stakeholder dialogue","Transformative evaluation leadership"],es:["Talleres de análisis y validación","Diálogo multicultural con actores","Liderazgo en evaluación transformadora"]}}
  ];

  // Figures (Entry 03)
  const FIGURES=[
    {n:35,suf:"+",lab:{en:"Years in development cooperation & evaluation",es:"Años en cooperación al desarrollo y evaluación"}},
    {n:100,suf:"+",lab:{en:"Assignments for UN, civil society & partners",es:"Asignaciones para ONU, sociedad civil y socios"}},
    {n:40,suf:"+",lab:{en:"Publications on transformative evaluation",es:"Publicaciones sobre evaluación transformadora"}},
    {n:25,suf:"+",lab:{en:"Countries across four continents",es:"Países en cuatro continentes"}}
  ];

  // Record (Entry 04) — flagship outputs
  const RECORD=[
    {y:2025,t:{en:"Final Evaluation — UNFPA 10th Country Programme, Bangladesh",es:"Evaluación Final — 10º Programa de País del UNFPA, Bangladesh"},
     ab:{en:"A systems-oriented evaluation of a complex country programme: design, Theory of Change, contribution analysis and final report under team leadership.",es:"Evaluación orientada a sistemas de un programa país complejo: diseño, Teoría del Cambio, análisis de contribución e informe final bajo liderazgo de equipo."},
     v:"UNFPA",tags:{en:["Team Lead","Country Programme","ToC"],es:["Líder","Programa País","TdC"]}},
    {y:2024,t:{en:"Evaluation of the Women's Peace & Humanitarian Fund",es:"Evaluación del Fondo de Paz y Humanitario para Mujeres"},
     ab:{en:"Global evaluation with in-person fieldwork in Colombia and remote data collection across Lebanon, Ukraine and Syria — gender and conflict at the centre.",es:"Evaluación global con trabajo de campo presencial en Colombia y recolección remota en Líbano, Ucrania y Siria — género y conflicto en el centro."},
     v:"ImpactReady / WPHF",tags:{en:["Senior Evaluator","Conflict","Multi-country"],es:["Evaluadora Senior","Conflicto","Multipaís"]}},
    {y:2023,t:{en:"Evaluation — UNFPA Asia & Pacific Regional Programme Action Plan",es:"Evaluación — Plan de Acción Regional Asia-Pacífico del UNFPA"},
     ab:{en:"Lead of a regional formative evaluation with fieldwork in Bangladesh and Thailand and remote work across the Pacific subregion.",es:"Líder de una evaluación formativa regional con trabajo de campo en Bangladesh y Tailandia y trabajo remoto en la subregión del Pacífico."},
     v:"UNFPA APRO",tags:{en:["Team Lead","Regional","Asia-Pacific"],es:["Líder","Regional","Asia-Pacífico"]}},
    {y:2021,t:{en:"To be or not to be an Evaluator for Transformational Change",es:"Ser o no ser Evaluador para el Cambio Transformacional"},
     ab:{en:"Chapter 8 in IDEAS' volume on transformational evaluation — perspectives from the Global South on the evaluator's role in justice-oriented change.",es:"Capítulo 8 del volumen de IDEAS sobre evaluación transformacional — perspectivas del Sur Global sobre el rol del evaluador en el cambio orientado a la justicia."},
     v:"IDEAS · Book chapter",tags:{en:["Authored","Transformative","Global South"],es:["Autoría","Transformadora","Sur Global"]}},
    {y:2017,t:{en:"Evaluation of UNFPA Support to GBV Prevention & Response",es:"Evaluación del Apoyo del UNFPA a la Prevención y Respuesta a la VBG"},
     ab:{en:"Gender and rights specialist, later lead evaluator: document review, fieldwork and triangulation across Guatemala and Bolivia.",es:"Especialista en género y derechos, luego evaluadora líder: revisión documental, trabajo de campo y triangulación en Guatemala y Bolivia."},
     v:"ITAD / UNFPA",tags:{en:["Lead Evaluator","GBV","Fieldwork"],es:["Evaluadora Líder","VBG","Campo"]}}
  ];

  // Case files (Entry 05) — full assignment list with verifiable countries
  const CASES=[
    {y:2025,t:{en:"Final External Evaluation — Bolivian Women: Your Rights in the Budget",es:"Evaluación Final Externa — Mujeres Bolivianas: Tus Derechos en el Presupuesto"},role:{en:"Team Lead",es:"Líder de Equipo"},client:"Oxfam / Futuralab",c:["Bolivia"],d:{en:"Feminist-lens design, participatory data collection, triangulation and quality assurance.",es:"Diseño con lente feminista, recolección participativa, triangulación y aseguramiento de calidad."}},
    {y:2025,t:{en:"Final Evaluation — UNFPA 10th Country Programme",es:"Evaluación Final — 10º Programa de País del UNFPA"},role:{en:"Team Lead",es:"Líder de Equipo"},client:"UNFPA Bangladesh",c:["Bangladesh"],d:{en:"Systems-oriented country programme evaluation with ToC and contribution analysis.",es:"Evaluación de programa país orientada a sistemas con TdC y análisis de contribución."}},
    {y:2025,t:{en:"SUFASEC Programme End-Term — Reference Group",es:"Programa SUFASEC Fin de Término — Grupo de Referencia"},role:{en:"Reference Group",es:"Grupo de Referencia"},client:"Terre des Hommes NL",c:["Thailand"],d:{en:"Methodological quality assurance across SE Asia and Latin America.",es:"Aseguramiento de calidad metodológica en el Sudeste Asiático y América Latina."}},
    {y:2024,t:{en:"Development Strategy with Bolivia 2021–2025",es:"Estrategia de Desarrollo con Bolivia 2021–2025"},role:{en:"Senior Evaluator / Gender",es:"Evaluadora Senior / Género"},client:"NIRAS / SIDA",c:["Bolivia"],d:{en:"Evaluation design, data collection and contributions to inception and final reports.",es:"Diseño de evaluación, recolección de datos y contribuciones a informes."}},
    {y:2024,t:{en:"Midterm — Gender Equality & SRHR of Adolescents",es:"Medio Término — Igualdad de Género y SDSR de Adolescentes"},role:{en:"Team Leader",es:"Líder de Equipo"},client:"UNFPA Bolivia",c:["Bolivia"],d:{en:"Evaluation design, fieldwork, inception and final report; team management.",es:"Diseño, trabajo de campo, informes de inicio y final; gestión de equipo."}},
    {y:2024,t:{en:"Women's Peace & Humanitarian Fund",es:"Fondo de Paz y Humanitario para Mujeres"},role:{en:"Senior Evaluator",es:"Evaluadora Senior"},client:"ImpactReady / WPHF",c:["Colombia","Lebanon","Ukraine","Syria"],d:{en:"In-person in Colombia; remote in Lebanon, Ukraine and Syria.",es:"Presencial en Colombia; remoto en Líbano, Ucrania y Siria."}},
    {y:2023,t:{en:"UNFPA Asia & Pacific Regional Programme Action Plan",es:"Plan de Acción Regional Asia-Pacífico del UNFPA"},role:{en:"Team Leader",es:"Líder de Equipo"},client:"UNFPA APRO",c:["Bangladesh","Thailand"],d:{en:"Design and lead implementation; fieldwork in Bangladesh and Thailand.",es:"Diseño e implementación líder; campo en Bangladesh y Tailandia."}},
    {y:2023,t:{en:"Regional Evaluation — Adolescent & Girl Pregnancy",es:"Evaluación Regional — Embarazo Adolescente"},role:{en:"Team Leader",es:"Líder de Equipo"},client:"UNFPA LACRO",c:["Guyana"],d:{en:"Regional interviews, Guyana case study, triangulation and final report.",es:"Entrevistas regionales, estudio de caso Guyana, triangulación e informe final."}},
    {y:2022,t:{en:"Gender Competencies for Service Providers — Caribbean",es:"Competencias de Género para Prestadores — Caribe"},role:{en:"Consultant",es:"Consultora"},client:"UNICEF LACRO",c:["Jamaica"],d:{en:"Validation and adaptation of gender competencies for frontline providers.",es:"Validación y adaptación de competencias de género para personal de primera línea."}},
    {y:2022,t:{en:"UNFPA Support to Population Dynamics & Data",es:"Apoyo del UNFPA a Dinámicas Poblacionales y Datos"},role:{en:"Senior Thematic Expert — Gender",es:"Experta Temática Senior — Género"},client:"ImpactReady / UNFPA",c:["Mexico","Azerbaijan"],d:{en:"Gender-lens contributions; Eastern Europe and Mexico case studies.",es:"Contribuciones con lente de género; estudios de caso de Europa del Este y México."}},
    {y:2022,t:{en:"Boost Participation & Leadership of Girls and Adolescents",es:"Impulso a la Participación y Liderazgo de Niñas y Adolescentes"},role:{en:"Team Leader",es:"Líder de Equipo"},client:"NEXUS / UNICEF Mexico",c:["Mexico"],d:{en:"Multi-state fieldwork, triangulation and final report.",es:"Trabajo de campo multiestatal, triangulación e informe final."}},
    {y:2021,t:{en:"Final Evaluation — Sixth Country Programme (2018–2022)",es:"Evaluación Final — Sexto Programa de País (2018–2022)"},role:{en:"Principal Evaluator & Gender Expert",es:"Evaluadora Principal y Experta en Género"},client:"UNFPA Bolivia",c:["Bolivia"],d:{en:"Survey design, interviews, triangulation and final report; team management.",es:"Diseño de encuesta, entrevistas, triangulación e informe final; gestión de equipo."}},
    {y:2020,t:{en:"GBSS — End of Son Preference & Undervaluing of Girls",es:"GBSS — Fin de la Preferencia por Hijos Varones"},role:{en:"Senior Thematic Evaluator",es:"Evaluadora Temática Senior"},client:"ImpactReady / UNFPA",c:["Azerbaijan","Vietnam"],d:{en:"Azerbaijan and Vietnam case studies; contributions to global analysis.",es:"Estudios de caso de Azerbaiyán y Vietnam; contribuciones al análisis global."}},
    {y:2020,t:{en:"Alliance with Danone — Women's Economic Empowerment",es:"Alianza con Danone — Empoderamiento Económico de las Mujeres"},role:{en:"Team Leader",es:"Líder de Equipo"},client:"NEXUS / UN Women Mexico",c:["Mexico"],d:{en:"Regional interviews, triangulation and final report; team management.",es:"Entrevistas regionales, triangulación e informe final; gestión de equipo."}},
    {y:2017,t:{en:"UNFPA Support to GBV Prevention & Response",es:"Apoyo del UNFPA a la Prevención y Respuesta a la VBG"},role:{en:"Gender Specialist → Lead Evaluator",es:"Especialista en Género → Evaluadora Líder"},client:"ITAD / UNFPA",c:["Guatemala","Bolivia"],d:{en:"Document review, fieldwork, triangulation and final reports.",es:"Revisión documental, trabajo de campo, triangulación e informes finales."}},
    {y:2016,t:{en:"Theory of Change — 'Down to Zero' against Child Sexual Exploitation",es:"Teoría del Cambio — 'Down to Zero' contra la Explotación Sexual Infantil"},role:{en:"Consultant / Facilitator",es:"Consultora / Facilitadora"},client:"ICCO",c:["Bolivia","Colombia","Nicaragua","Peru"],d:{en:"Workshop design and facilitation; systematization and ToC finalization.",es:"Diseño y facilitación de talleres; sistematización y finalización de la TdC."}},
    {y:2014,t:{en:"EU Support to Gender Equality & Women's Empowerment",es:"Apoyo de la UE a la Igualdad de Género"},role:{en:"Gender Expert / Evaluator",es:"Experta en Género / Evaluadora"},client:"ITAD / European Union",c:["Bolivia"],d:{en:"Interviews, document review, triangulation and final report.",es:"Entrevistas, revisión documental, triangulación e informe final."}}
  ];

  // Publications (Entry 06, compact)
  const PUBS=[
    {y:2021,t:{en:"<b>To be or not to be an Evaluator for Transformational Change</b> — Perspectives from the Global South (Ch. 8). IDEAS.",es:"<b>Ser o no ser Evaluador para el Cambio Transformacional</b> — Perspectivas del Sur Global (Cap. 8). IDEAS."}},
    {y:2019,t:{en:"<b>Evaluation for Transformational Change</b> — Opportunities & Challenges for the SDGs (editor). IDEAS.",es:"<b>Evaluación para el Cambio Transformacional</b> — Oportunidades y Desafíos para los ODS (editora). IDEAS."}},
    {y:2018,t:{en:"<b>To 'Leave No One Behind'</b> — Capacity Building in Gender Transformative Evaluation. EvalGender+.",es:"<b>'No Dejar a Nadie Atrás'</b> — Fortalecimiento en Evaluación Transformadora de Género. EvalGender+."}},
    {y:2018,t:{en:"<b>Cultural Competence & Power Issues in Evaluations</b> — a gender transformative perspective. AEA365.",es:"<b>Competencia Cultural y Poder en las Evaluaciones</b> — perspectiva transformadora de género. AEA365."}},
    {y:2016,t:{en:"<b>Cultural Competence & Power Dynamics in Evaluation</b> — Reflections from a Gender Perspective.",es:"<b>Competencia Cultural y Dinámicas de Poder en Evaluación</b> — Reflexiones desde el Género."}},
    {y:2015,t:{en:"<b>Decalogue on Evaluation from a Gender Perspective</b> — EvalGender+ launch, Kathmandu.",es:"<b>Decálogo sobre Evaluación desde una Perspectiva de Género</b> — lanzamiento EvalGender+, Katmandú."}},
    {y:2014,t:{en:"<b>Latin American Feminist Perspectives on Gender Power in Evaluation</b>. Guilford Press.",es:"<b>Perspectivas Feministas Latinoamericanas sobre el Poder de Género en la Evaluación</b>. Guilford Press."}},
    {y:2011,t:{en:"<b>Toolkit on Poverty Reduction through Tourism</b>. Geneva: ILO.",es:"<b>Caja de Herramientas: Reducción de la Pobreza a través del Turismo</b>. Ginebra: OIT."}},
    {y:2001,t:{en:"<b>Investigando con Ética</b> — Aportes para la Reflexión-Acción (with S. Rance). CIEPP.",es:"<b>Investigando con Ética</b> — Aportes para la Reflexión-Acción (con S. Rance). CIEPP."}}
  ];

  return {COUNTRIES,REGIONS,PRACTICE,FIGURES,RECORD,CASES,PUBS};
})();
