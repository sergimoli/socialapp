export const SerializeForm = (form) => {
  //fem el objecte formData per accessar dades del formulari
  const formData = new FormData(form);
  const completeObj = {};
  console.log(formData);

  for (let [name, value] of formData) {
    // console.log(name, value);
    completeObj[name] = value;
  }
  return completeObj;
};
