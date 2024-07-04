export default function handler(req, res) {
  const data = {
    name: "john Doe",
  };

  res.status(200).json(data);
}
