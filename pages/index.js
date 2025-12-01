import Image from "next/image";

function Home() {
  const style = {
    fontSize: 250,
  };
  return (
    <div style={{ textAlign: "center" }}>
      <Image src="https://iili.io/fqJtTKu.md.png" width={250} alt="logo" />
      <h1>A Game da Sorte está tomando forma.</h1>
      <h2>O próximo passo é ver os primeiros jogadores entrando.</h2>
      <h3>
        Plataforma em construção... <span style={style}>🏗️</span>
      </h3>
    </div>
  );
}

export default Home;
