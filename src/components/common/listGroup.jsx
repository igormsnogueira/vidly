import React from "react";

const ListGroup = ({
  items,
  onItemSelect,
  textProperty,
  valueProperty,
  selectedItem
}) => {
  return (
    <ul className="list-group">
      {items.map(item => (
        <li
          key={item[valueProperty]} //item[valueProperty] é o mesmo que item._id nesse caso, pois o default props é _id, mas o programador que usar o componente pode passar por props outro atributo pra criar a lista
          className={
            item === selectedItem ? "list-group-item active" : "list-group-item"
          }
          onClick={() => onItemSelect(item)}
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  //para ser mais flexivel ao inves de usarmos item.name e item._id, vamos deixar o programador que usar o componente decidir qual propriedade será usada, assim nossa lista fica flexivel , no caso nós queremos o name e o _id logo por padrão usaremos elas como defaultProps
  textProperty: "name",
  valueProperty: "_id"
};

export default ListGroup;
