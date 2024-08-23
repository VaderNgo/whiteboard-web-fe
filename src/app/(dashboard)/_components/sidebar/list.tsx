"use client";

import { Item } from "./item";

export const List = () => {
    return (
        <ul className="space-y-4">
            <Item key={1} id={"1"} name="Item" imageUrl="https://via.placeholder.com/150" />
            <Item key={2} id={"2"} name="Item" imageUrl="https://via.placeholder.com/150" />
            <Item key={3} id={"3"} name="Item" imageUrl="https://via.placeholder.com/150" />
        </ul>
    );
};
