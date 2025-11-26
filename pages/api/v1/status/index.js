//  /api/v1/satus
function status(request, response) {
  response
    .status(200)
    .json({ affirmacao: "sou muito foda e em cima da média" });
}

export default status;
