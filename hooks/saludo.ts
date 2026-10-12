// En las grabaciones vallenatas el cantante saluda por su nombre a amigos y compadres
// (https://es.wikipedia.org/wiki/Saludo_vallenato); el Cacique saluda así a quien abre la sesión.
export const saludoGrabado = (nombre: string, repo: string | undefined) => {
  const compadre = nombre.trim().split(/\s+/)[0]
  if (!compadre) return undefined
  return repo ? `¡Un saludo pa’ mi compadre ${compadre}, allá en ${repo}!` : `¡Un saludo pa’ mi compadre ${compadre}!`
}

export const nombreDelRepo = (raiz: string) => raiz.split('/').filter(Boolean).at(-1)
