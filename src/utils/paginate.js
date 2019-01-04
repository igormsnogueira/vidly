import _ from "lodash";

export function paginate(items, currentPage, pageSize) {
  const startIndex = (currentPage - 1) * pageSize; //retorna o valor do index do 1 item da pagina em questão
  return _(items)
    .slice(startIndex)
    .take(pageSize)
    .value(); //_(array) transforma o array num objeto lodash, slice nos diz a partir de que item vamos pegar daquele array(),take nos diz quantos itens vamos pegar a partir daquele array, e value converte de objeto lodash objeto para array denovo
}
