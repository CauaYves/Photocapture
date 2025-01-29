const loadClientStyles = async(clientName: string) => {
  return import(`../../public/themes/${clientName}/styles.scss`)
    .then(() => {
      console.log('%c ' + 'Estilos carregados para o cliente: ' + clientName, 'color: green; font-weight:bold');
    })
    .catch((error) => {
      console.log('%c ' + 'Erro ao carregar estilos para o cliente: ' + clientName, 'color: red; font-weight:bold');
    });
};

export default loadClientStyles