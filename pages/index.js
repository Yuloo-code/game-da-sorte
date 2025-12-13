import Head from "next/head";
function Home() {
  const style = {
    fontSize: 250,
  };
  return (
    <>
      <Head>
        <title>7gamedasorte</title>
      </Head>
      <div style={{ textAlign: "center" }}>
        <h1>A Game da Sorte está tomando forma.</h1>
        <h2>O próximo passo é ver os primeiros jogadores entrando.</h2>
        <h3>
          Plataforma em construção... <span style={style}>🏗️</span>
        </h3>
      </div>
    </>
  );
}

export default Home;
