export const obtenerUsuarios= async()=>{
    const urlUsuarios='https://reqres.in/api/users?page=1';
    const resp=await fetch(urlUsuarios);
    const {data:usuarios}=await resp.json();
    return usuarios;
}
