// enlloc de retornar un jsx retorna un objecte

import { useState } from "react";

export const useForm = (InitialObj = {}) => {
  const [form, setForm] = useState(InitialObj);
  const changed = ({ target }) => {
    const { name, value } = target; //destructurem target
    setForm({
      ...form,
      [name]: value,
    });
    // console.log(form);
  };
  return {
    form,
    changed,
  };
};
