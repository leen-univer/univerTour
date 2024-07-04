
import Link from "react-csv/components/Link";
const ShowMenu = () => {
  return (
    <>
      <div className="navlist">
        <ul>
          <li>
            <Link to="">Home</Link>
          </li>
          <li>
            <Link to="">Plans</Link>
          </li>
          <li>
            <Link to="">Login</Link>
          </li>
          <li className="list">
            <Link to="" className="book-demo change_new_clr">
              Book a demo
            </Link>
          </li>
          <li className="list">
            <Link to="" className="get-start change_new_bg_clr">
              Get started for free
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ShowMenu;
