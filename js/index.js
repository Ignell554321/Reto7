'use strict';

import { Usuario } from "./usuario.js";
import {obtenerUsuarios} from './httpUsersProvider.js';

const usuariosData = 'crud-usuario';
let usuarios = [];
let timeoutId = 0;

const generateId = () => {
  if (localStorage.getItem('crud-usuarios-id')) {
    let id = +localStorage.getItem('crud-usuarios-id');
    localStorage.setItem('crud-usuarios-id', ++id);
    return id;
  } else {
    localStorage.setItem('crud-usuarios-id', 1);
    return 1;
  }
};


const getFormData = () => {
  const documentformUsuarios = document.forms['formUsuarios'];
  const id = documentformUsuarios['id'].value;
  const nombre = documentformUsuarios['nombres'].value;
  const apellidos = documentformUsuarios['apellidos'].value;
  const email = documentformUsuarios['email'].value;
  const urlImagen = documentformUsuarios['urlImagen'].value;
  return ({ id, nombre, apellidos,email, urlImagen });
};

const validateForm = () => {
    const documentformUsuarios = document.forms['formUsuarios'];
     const nombre = documentformUsuarios['nombres'].value;
     const apellidos = documentformUsuarios['apellidos'].value;
     const email = documentformUsuarios['email'].value;
     const urlImagen = documentformUsuarios['urlImagen'].value;

  return [nombre.trim(), apellidos.trim(), email.trim(), urlImagen.trim()].includes('');
};

const resetForm = () => {
  const documentformUsuarios = document.forms['formUsuarios'];
  documentformUsuarios['id'].value = '';
  documentformUsuarios['nombres'].value = '';
  documentformUsuarios['apellidos'].value = '';
  documentformUsuarios['email'].value = '';
  documentformUsuarios['urlImagen'].value = '';
};

const createUsuario = () => {
  const { nombre, apellidos, email, urlImagen } = getFormData();
  if (validateForm()) {
    alert('Completa todos los campos');

  } else {
    usuarios = [...usuarios, new Usuario(generateId(), email, nombre,apellidos, urlImagen)];
    localStorage.setItem(usuariosData, JSON.stringify(usuarios));
    resetForm();
    readUsuarios();

  }
};

const readUsuarios = () => {
  const tBodyPersonal = document.querySelector('#tBodyPersonal');
  tBodyPersonal.innerHTML = '';
  usuarios.forEach((element) => {
    const { _id, _email, _nombre, _apellidos, _urlImagen } = element;

    const fragment = document.createDocumentFragment();
    const tableRow = document.createElement('tr');

    const tHId = document.createElement('th');
    tHId.textContent = _id;

    const tDNombre = document.createElement('td');
    tDNombre.textContent = _nombre;

    const tDApellidos = document.createElement('td');
    tDApellidos.textContent = _apellidos;

    const tDEmail = document.createElement('td');
    tDEmail.textContent = _email;

    const tDUrlImage = document.createElement('td');
    tDUrlImage.style.maxWidth = '128px'

    const tDUrlImageImg = document.createElement('img');
    tDUrlImageImg.setAttribute('src', _urlImagen);
    tDUrlImageImg.setAttribute('alt', _nombre);
    tDUrlImageImg.classList.add('img-fluid');

    tDUrlImage.appendChild(tDUrlImageImg);

    const tDActions = document.createElement('td');

    const tDButtonRead = document.createElement('button');
    tDButtonRead.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    tDButtonRead.addEventListener('click', () => readUsuario(_id));
    tDButtonRead.classList.add('btn');
    tDButtonRead.classList.add('btn-sm');
    tDButtonRead.classList.add('bg-success');
    tDButtonRead.classList.add('rounded');
    tDButtonRead.classList.add('border-0');
    tDButtonRead.classList.add('mx-1');

    const tDButtonDelete = document.createElement('button');
    tDButtonDelete.innerHTML = '<i class="bi bi-trash3-fill"></i>';
    tDButtonDelete.addEventListener('click', () => deleteUsuario(_id));
    tDButtonDelete.classList.add('btn');
    tDButtonDelete.classList.add('btn-sm');
    tDButtonDelete.classList.add('bg-danger');
    tDButtonDelete.classList.add('rounded');
    tDButtonDelete.classList.add('border-0');
    tDButtonDelete.classList.add('mx-1');

    tDActions.appendChild(tDButtonRead);
    tDActions.appendChild(tDButtonDelete);

    tableRow.appendChild(tHId);
    tableRow.appendChild(tDNombre);
    tableRow.appendChild(tDApellidos);
    tableRow.appendChild(tDEmail);
    tableRow.appendChild(tDUrlImage);
    tableRow.appendChild(tDActions);
    fragment.appendChild(tableRow);
    tBodyPersonal.appendChild(fragment);

  });

};

const readUsuario = (id) => {
  const documentformUsuarios = document.querySelector('#formUsuarios');


  const usuario = usuarios.find((element) => {
    return element._id === id;
  });
  const { _id, _nombre, _apellidos, _email, _urlImagen } = usuario;


  documentformUsuarios['id'].value = _id;
  documentformUsuarios['nombres'].value = _nombre;
  documentformUsuarios['apellidos'].value = _apellidos;
  documentformUsuarios['email'].value = _email;
  documentformUsuarios['urlImagen'].value = _urlImagen;

  documentformUsuarios['id'].classList.add('active');
  documentformUsuarios['nombres'].classList.add('active');
  documentformUsuarios['apellidos'].classList.add('active');
  documentformUsuarios['email'].classList.add('active');
  documentformUsuarios['urlImagen'].classList.add('active');
};

const updateUsuario = () => {
  const { id, nombre, apellidos, email, urlImagen } = getFormData();


  if (validateForm()) {
    alert('Completar todos los campos');
  } else {
    usuarios = usuarios.map((element) => {
      if (element._id !== +id) {
        return element;
      } else {
        element._nombre = nombre;
        element._apellidos = apellidos;
        element._email = email;
        element._urlImagen = urlImagen;
        return element;
      }
    });
    localStorage.setItem(usuariosData, JSON.stringify(usuarios));
    resetForm();
    readUsuarios();
  }
};

const deleteUsuario = (id) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success mx-2',
      cancelButton: 'btn btn-danger mx-2'
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: '¿Está seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '¡Sí, elimínalo!',
    cancelButtonText: '¡No, cancélalo!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      usuarios = usuarios.filter((element) => {
        return element._id !== id;
      });
      localStorage.setItem(usuariosData, JSON.stringify(usuarios));
      readUsuarios();
      resetForm();
      swalWithBootstrapButtons.fire(
        '¡Eliminado!',
        'Tu registro ha sido eliminado.',
        'success'
      );
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelado',
        'Tu registro está seguro',
        'error'
      );
    }
  });
};


const apiWeb=()=>{
  const tBodyApi = document.querySelector('#tBodyApi');
  obtenerUsuarios().then( res => {
      res.forEach((element) => {

        const { id, email, first_name, last_name, avatar } = element;

        const fragment = document.createDocumentFragment();
        const tableRow = document.createElement('tr');

        const tHId = document.createElement('th');
        tHId.textContent = id;

        const tDEmail = document.createElement('td');
        tDEmail.textContent = email;

        const tDNombres = document.createElement('td');
        tDNombres.textContent = first_name;

        const tDApellidos = document.createElement('td');
        tDApellidos.textContent = last_name;

        const tDUrlImage = document.createElement('td');
        tDUrlImage.style.maxWidth = '128px'

        const tDUrlImageImg = document.createElement('img');
        tDUrlImageImg.setAttribute('src', avatar);
        tDUrlImageImg.setAttribute('alt', first_name);
        tDUrlImageImg.classList.add('img-fluid');

        tDUrlImage.appendChild(tDUrlImageImg);
        tableRow.appendChild(tHId);
        tableRow.appendChild(tDEmail);
        tableRow.appendChild(tDNombres);
        tableRow.appendChild(tDApellidos);
        tableRow.appendChild(tDUrlImage);
        fragment.appendChild(tableRow);
        tBodyApi.appendChild(fragment);

      }); 
  })
}

async function apiAxios() {
  try {
    const tBodyAxios = document.querySelector('#tBodyAxios');
    const response = await axios.get('https://reqres.in/api/users?page=1');
     response.data.data.forEach((element) => {
      console.log(element);
        const { id, email, first_name, last_name, avatar } = element;

        const fragment = document.createDocumentFragment();
        const tableRow = document.createElement('tr');

        const tHId = document.createElement('th');
        tHId.textContent = id;

        const tDEmail = document.createElement('td');
        tDEmail.textContent = email;

        const tDNombres = document.createElement('td');
        tDNombres.textContent = first_name;

        const tDApellidos = document.createElement('td');
        tDApellidos.textContent = last_name;

        const tDUrlImage = document.createElement('td');
        tDUrlImage.style.maxWidth = '128px'

        const tDUrlImageImg = document.createElement('img');
        tDUrlImageImg.setAttribute('src', avatar);
        tDUrlImageImg.setAttribute('alt', first_name);
        tDUrlImageImg.classList.add('img-fluid');

        tDUrlImage.appendChild(tDUrlImageImg);
        tableRow.appendChild(tHId);
        tableRow.appendChild(tDEmail);
        tableRow.appendChild(tDNombres);
        tableRow.appendChild(tDApellidos);
        tableRow.appendChild(tDUrlImage);
        fragment.appendChild(tableRow);
        tBodyAxios.appendChild(fragment);

      }); 
  } catch (error) {
    console.error(error);
  }
}

const documentReady = () => {
  const formUsuarios = document.querySelector('#formUsuarios');

  const submitUsuario = (e) => {
    e.preventDefault();
    const id = document.getElementById('formId').value;
    if (id === '') {
      createUsuario();
    } else {
      updateUsuario();
    }
  };

  if (localStorage.getItem(usuariosData)) {
    usuarios = JSON.parse(localStorage.getItem(usuariosData));
    readUsuarios();
  } else {
    localStorage.setItem(usuariosData, JSON.stringify(usuarios));
  }


  document.getElementById('list-home-list').addEventListener('click', resetForm);
  document.getElementById('list-profile-list').addEventListener('click', apiWeb);
  document.getElementById('list-messages-list').addEventListener('click',apiAxios);

  formUsuarios.addEventListener('submit', submitUsuario);
};

document.addEventListener('DOMContentLoaded', documentReady);