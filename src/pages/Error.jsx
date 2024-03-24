import { Link } from "react-router-dom";
import { IconLeftArrow } from "../components/Icons/Icons";

const Error = () => {
  return (
    <div className="rounded-sm px-5 py-10 sm:py-20 grid place-content-center place-items-center lg:h-[100vh]">
      <div className="mx-auto">
        <div className="text-center tex-2xl lg:text-4xl">
          <h2 className="mb-3 font-semibold">
            Lo sentimos, no se puede encontrar la página.
          </h2>
          <p className="font-medium">
            La página que estabas buscando parece haber sido movida, eliminada o
            no existe.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90"
          >
            <IconLeftArrow />
            <button className="bg-blue-500 p-4 rounded-2xl text-xl">
              Volver al Inicio
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
