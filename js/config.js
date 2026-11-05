// Repositório do GitHub que recebe as sugestões (formato "usuario/repositorio")
const REPO = "EloPo/mapa-juridico";
function suggestURL(){
  const body=["**Nome do evento:**","","**Data (início e fim):**","","**Cidade e UF:**","","**Local:**","","**Organização:**","","**Tipo:** Institucional / Acadêmico / Mercado","","**Área do Direito:**","","**Link oficial:**",""].join("\n");
  return "https://github.com/"+REPO+"/issues/new?"+new URLSearchParams({title:"[Sugestão] ",body,labels:"sugestao-evento"}).toString();
}
