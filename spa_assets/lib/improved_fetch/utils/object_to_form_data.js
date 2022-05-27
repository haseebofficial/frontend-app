export default function objectToFormData(props) {
  let data = new FormData();
  Object.entries(props).forEach(([k, v]) => data.append(k, v));
  return data;
}