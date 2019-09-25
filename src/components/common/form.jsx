import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };
  validate = () => {
    //validating all inputs when form was submitted
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options); //arg1 é o objeto a ser validado, arg 2 o schema a ser aplicado ao objeto e arg 3, por padrao o Joi ao encontrar um erro , para de procurar por outros(abortEarly) dai colocamos para ele continuar ate achar todos.
    if (!error) return null; //se nao achar erro na validação retorna null
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message; //pra cada elemento do array de erros , considerado como item, inserimos no array errors, com a key tendo o path(nome) do input e o valor sendo a mensagem de erro.
    return errors;
  };
  validateProperty = ({ name, value }) => {
    //validate each input
    const obj = { [name]: value }; //forma um objeto com o nome do input e o valor atual dela, p/ser validado
    const schema = { [name]: this.schema[name] }; //cria o schema usando o name do input atual e copiando o valor que esse input deve ter do schema principal.
    const { error } = Joi.validate(obj, schema); //nao precisa do options pois ao digitar algo ou apagar queremos mostrar um erro por vez.
    return error ? error.details[0].message : null; //se existir erro, retorna a mensagem dele, se nao retorna null
  };
  handleSubmit = e => {
    e.preventDefault(); //evita que a pagina seja recarregada

    const errors = this.validate(); //faz a validação
    this.setState({ errors: errors || {} }); //atualiza o state errors com o objeto errors se ele existir, se for null, coloca um objeto vazia
    if (errors) return; //se encontrou erro retorna vazio, ou seja , nao segue com o codigo.
    this.doSubmit(); //metodo que comunica com o servidor pra mandar os dados e receber uma resposta.
  };
  handleChange = ({ currentTarget: input }) => {
    //object destructuring que pega o 'e' q vem como parametro e pega o e.currentTarget dele e usa como uma variavel chamada input
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input); //verifica se há algum erro no que o usuario inseriu no input ate entao
    if (errorMessage) errors[input.name] = errorMessage;
    //se tiver adiciona ao state errors com a key do nome do input a mensagem de erro
    else delete errors[input.name]; //se nao, apaga o erro relacionado a esse input, caso tenha tido algum erro e foi corrigido.

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };
  renderButton = label => {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  };
  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        label={label}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
  renderSelect(name, label, options) {
    const { data, errors } = this.state;
    return (
      <Select
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
