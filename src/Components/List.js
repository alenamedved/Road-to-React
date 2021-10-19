import React from "react";
import Item from "./Item";

const List = ({ list, onRemoveItem }) => {
  console.log("List renders");
  return (
    <ol>
      {list.map((item) => (
        <Item 
          key={item.objectID} 
          item={item} 
          onRemoveItem={onRemoveItem} 
        />
      ))}
    </ol>
  );
};

export default List;
