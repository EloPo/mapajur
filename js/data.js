// Dados do site: estados, tipos, eventos e feriados.
// Para adicionar um evento, inclua uma linha em RAW seguindo a ordem dos campos.

const UFN={AC:"Acre",AL:"Alagoas",AP:"Amapá",AM:"Amazonas",BA:"Bahia",CE:"Ceará",DF:"Distrito Federal",ES:"Espírito Santo",GO:"Goiás",MA:"Maranhão",MT:"Mato Grosso",MS:"Mato Grosso do Sul",MG:"Minas Gerais",PA:"Pará",PB:"Paraíba",PR:"Paraná",PE:"Pernambuco",PI:"Piauí",RJ:"Rio de Janeiro",RN:"Rio Grande do Norte",RS:"Rio Grande do Sul",RO:"Rondônia",RR:"Roraima",SC:"Santa Catarina",SP:"São Paulo",SE:"Sergipe",TO:"Tocantins"};

const TYPES={inst:{label:"Institucional",desc:"OAB, tribunais, MP e Legislativo",c:"var(--t-inst)"},acad:{label:"Acadêmico",desc:"Institutos, universidades e associações",c:"var(--t-acad)"},merc:{label:"Mercado",desc:"Feiras, lawtechs e gestão jurídica",c:"var(--t-merc)"}};

// [id, nome, início, fim, cidade, UF, local, organização, tipo, área, url]
const RAW=[
["ibrademp","Congresso IBRADEMP 2026","2026-03-10","2026-03-11","São Paulo","SP","","IBRADEMP","acad","Empresarial","https://plataformajuris.com.br/eventos-juridicos-2026/"],
["ibdp44","44º Simpósio de Direito Previdenciário do IBDP","2026-03-27","2026-03-27","São Paulo","SP","","IBDP","acad","Previdenciário","https://plataformajuris.com.br/eventos-juridicos-2026/"],
["abrampa","XXIV Congresso Brasileiro do MP de Meio Ambiente (ABRAMPA)","2026-04-08","2026-04-10","Pirenópolis","GO","","ABRAMPA","inst","Ambiental","https://blog.legishub.com.br/principais-eventos-juridicos-de-2026/"],
["enps","7º Encontro Nacional de Procuradorias de Saúde (ENPS)","2026-04-22","2026-04-23","Belém","PA","","Procuradorias de Saúde","inst","Saúde","https://blog.legishub.com.br/principais-eventos-juridicos-de-2026/"],
["interior","I Conferência Nacional de Interiorização da Advocacia","2026-05-07","2026-05-08","Cuiabá","MT","","CFOAB e OAB-MT","inst","Advocacia","https://www2.oabrs.org.br/jornalDaOrdem/oab-nacional-convida-a-advocacia-gaucha-para-a-i-conferencia-nacional-de-interiorizacao-da-advocacia/52313"],
["ab2l","AB2L Lawtech Experience 2026","2026-05-13","2026-05-14","Rio de Janeiro","RJ","Píer Mauá","AB2L","merc","Tecnologia e inovação","https://www.projuris.com.br/agenda-eventos/ab2l-lawtech-experience-2026-projuris-patrocina/"],
["mercosul","XVI Congresso do Mercosul de Direito de Família e Sucessões","2026-05-14","2026-05-15","Bento Gonçalves","RS","","IBDFAM","acad","Família e sucessões","https://plataformajuris.com.br/eventos-juridicos-2026/"],
["trepe","I Congresso do TRE-PE e III Congresso Integrado de Direito Eleitoral","2026-05-14","2026-05-15","Recife","PE","Recife ExpoCenter","TRE-PE e Ideppe","inst","Eleitoral","https://www.tre-pe.jus.br/comunicacao/noticias/2026/Abril/recife-sedia-congresso-de-direito-eleitoral-com-foco-na-integridade-das-eleicoes-2026"],
["ufsc","XX Congresso de Direito UFSC","2026-05-19","2026-05-22","Florianópolis","SC","Centro de Cultura e Eventos da UFSC","CAXIF / UFSC","acad","Geral","https://congressodireitoufsc.com.br/"],
["cgjne","IV Congresso de Gestão Jurídica do Nordeste (CGJNE)","2026-05-28","2026-05-29","Fortaleza","CE","Oásis Atlântico Imperial","CGJNE","merc","Gestão jurídica","https://www.kuriertecnologia.com.br/blog/eventos-para-advogados-2026/"],
["cidc","XXIV Congresso Internacional de Direito Constitucional (CIDC)","2026-05-29","2026-05-30","João Pessoa","PB","","CIDC","acad","Constitucional","https://doity.com.br/xxiv-congresso-internacional-de-direito-constitucional-cidc-2026"],
["expodireito","ExpoDireito Brasil 2026","2026-05-29","2026-05-30","Brasília","DF","","ExpoDireito","merc","Geral","https://www.onfly.com.br/blog/congressos-de-direito/"],
["ieprev","12º Congresso Brasileiro de Direito Previdenciário do IEPREV","2026-07-03","2026-07-04","Belo Horizonte","MG","","IEPREV","acad","Previdenciário","https://plataformajuris.com.br/eventos-juridicos-2026/"],
["oabrr","Conferência Estadual da Jovem Advocacia 2026","2026-08-06","2026-08-06","Boa Vista","RR","Auditório Hesmone Saraiva Grangeiro","OAB-RR","inst","Advocacia","https://www.folhabv.com.br/?p=654799"],
["oabes","Congresso Estadual da Advocacia 2026","2026-08-12","2026-08-13","Vitória","ES","Espaço Patrick Ribeiro","OAB-ES","inst","Advocacia","https://esbrasil.com.br/vitoria-sera-palco-de-congresso-sobre-a-justica-brasileira/"],
["aaprev","5º Congresso Previdenciário da AAPREV","2026-08-13","2026-08-14","Recife","PE","Shopping RioMar","AAPREV","acad","Previdenciário","https://www.aaprev.com/congresso"],
["ibdt","XI Congresso Brasileiro de Direito Tributário Internacional","2026-09-09","2026-09-11","São Paulo","SP","Salão Nobre da Faculdade de Direito da USP","IBDT","acad","Tributário","https://congresso.ibdt.org.br/"],
["penal","Congresso Brasileiro de Direito Penal","2026-09-18","2026-09-19","Fortaleza","CE","","Organização do CBDP","acad","Penal","https://plataformajuris.com.br/eventos-juridicos-2026/"],
["conat","47º Congresso Nacional da Advocacia Trabalhista (CONAT)","2026-09-23","2026-09-25","Brasília","DF","Centro de Convenções Ulysses Guimarães","ABRAT","acad","Trabalhista","https://jurinews.com.br/index.php/advocacia/47o-conat-reune-1-500-inscritos-em-brasilia-para-debater-os-rumos-do-direito-do-trabalho"],
["cbame","XII CBAME – Congresso Brasileiro de Arbitragem e Mediação Empresarial","2026-09-24","2026-09-24","Brasília","DF","","CBAME","acad","Arbitragem e mediação","https://plataformajuris.com.br/eventos-juridicos-2026/"],
["ebradi","Congresso EBRADI 2026","2026-09-29","2026-09-29","São Paulo","SP","Community Creators Academy","EBRADI","merc","Tecnologia e inovação","https://www.ebradi.com.br/evento/congresso-ebradi-2026/"],
["expojud","ExpoJud 2026","2026-10-06","2026-10-08","Brasília","DF","CICB","ExpoJud","merc","Tecnologia e inovação","https://expojudcongresso2026.lovable.app/"],
["ibdp20","XX Congresso Brasileiro de Direito Previdenciário","2026-10-08","2026-10-09","Curitiba","PR","Universidade Positivo","IBDP","acad","Previdenciário","https://www.ibdp.org.br/eventos/xx-congresso-brasileiro-de-direito-previdenciario/"],
["csbdc","3º Congresso Sul-Brasileiro de Direito Comercial","2026-10-22","2026-10-23","Curitiba","PR","PUCPR, Campus Curitiba","CSBDC","acad","Empresarial","https://www.congressosuldc.com.br/home"],
["fenalaw","Fenalaw 2026","2026-10-27","2026-10-29","São Paulo","SP","Transamérica Expo Center","Fenalaw","merc","Gestão jurídica","https://www.kuriertecnologia.com.br/blog/eventos-para-advogados-2026/"],
["saude","XI Congresso Brasileiro de Direito e Saúde","2026-11-03","2026-11-06","Fortaleza","CE","Auditório da OAB Ceará","IBDS","acad","Saúde","https://congressodedireitoesaude.com.br/"],
["dcfp","VI Congresso Internacional de Direito Constitucional e Filosofia Política","2026-11-05","2026-11-07","Belém","PA","Faculdade de Direito da UFPA","UFPA e Associação Serras de Minas","acad","Constitucional","https://plataforma9.com/congressos/vi-congresso-direito-constitucional-filosofia-politica-dcfp-belem-ufpa-2026.htm"],
["ibdfamrs","XII Congresso Gaúcho de Direito das Famílias e Sucessões","2026-11-06","2026-11-06","Novo Hamburgo","RS","","IBDFAM-RS","acad","Família e sucessões","https://ibdfam.org.br/eventos"],
["ibdfamrn","VIII Seminário Potiguar de Direito das Famílias e Sucessões","2026-11-06","2026-11-06","Natal","RN","","IBDFAM-RN","acad","Família e sucessões","https://ibdfam.org.br/eventos"],
["ibdfamabc","V Simpósio de Direito das Famílias e Sucessões – Núcleo ABCDMR","2026-11-06","2026-11-06","São Bernardo do Campo","SP","","IBDFAM-SP","acad","Família e sucessões","https://ibdfam.org.br/eventos"],
["parlamentar","3º Congresso Brasileiro de Direito Parlamentar","2026-11-10","2026-11-11","Brasília","DF","Senado Federal","Advocacia do Senado Federal","inst","Constitucional","https://www12.senado.leg.br/assessoria-de-imprensa/releases/senado-vai-sediar-o-3o-congresso-brasileiro-de-direito-parlamentar"],
["ibdfampp","IV Congresso de Direito das Famílias e Sucessões do IBDFAM","2026-11-12","2026-11-12","Presidente Prudente","SP","","IBDFAM-SP, Núcleo Presidente Prudente","acad","Família e sucessões","https://ibdfam.org.br/eventos"],
["anoreg","XXVI Congresso da ANOREG/BR e IX CONCART","2026-11-17","2026-11-19","Brasília","DF","Hotel Royal Tulip Brasília Alvorada","ANOREG/BR","acad","Notarial e registral","https://anoreg.org.br/congresso/"],
["cnab","25ª Conferência Nacional da Advocacia Brasileira","2026-11-23","2026-11-25","Salvador","BA","Centro de Convenções Salvador","CFOAB e OAB-BA","inst","Advocacia","https://conferencia.oab.org.br/"],
["biodireito","Diálogos em Biodireito","2026-11-25","2026-11-25","Rio de Janeiro","RJ","","IBDFAM","acad","Família e sucessões","https://ibdfam.org.br/eventos"],
["ibda","40º Congresso Brasileiro de Direito Administrativo","2026-11-25","2026-11-27","Curitiba","PR","","IBDA","acad","Administrativo","https://congresso.ibda.com.br/"],
["religioso","7º Congresso Brasileiro de Direito Religioso","2026-11-26","2026-11-27","Brasília","DF","Hípica Hall","IBDR","acad","Constitucional","https://doity.com.br/7-congresso-brasileiro-de-direito-religioso"],
["ibet","XXIII Congresso Nacional de Estudos Tributários","2026-12-02","2026-12-04","São Paulo","SP","Local a confirmar","IBET","acad","Tributário","https://www.ibet.com.br/"]
];
const EVENTS=RAW.map(r=>({id:r[0],nome:r[1],ini:r[2],fim:r[3],cidade:r[4],uf:r[5],local:r[6],org:r[7],tipo:r[8],area:r[9],url:r[10]}));
const BYID=Object.fromEntries(EVENTS.map(e=>[e.id,e]));

const HOL={"2026-01-01":["Confraternização Universal",0],"2026-02-16":["Carnaval",0],"2026-02-17":["Carnaval",0],"2026-04-03":["Sexta-feira Santa",0],"2026-04-21":["Tiradentes",0],"2026-05-01":["Dia do Trabalho",0],"2026-06-04":["Corpus Christi",0],"2026-08-11":["Dia da Advocacia",1],"2026-09-07":["Independência",0],"2026-10-12":["N. Sra. Aparecida",0],"2026-11-02":["Finados",0],"2026-11-15":["Proclamação da República",0],"2026-11-20":["Consciência Negra",0],"2026-12-08":["Dia da Justiça",1],"2026-12-25":["Natal",0]};
