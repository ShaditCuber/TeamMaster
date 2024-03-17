import { Link } from "react-router-dom";
import { IconLeftArrow } from "../components/Icons/Icons"

const Error = () => {
    return (
        <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:py-20">
            <div className="mx-auto max-w-[410px]">

                <div className="mt-7.5 text-center">
                    <h2 className="mb-3 text-2xl font-bold text-black dark:text-white">
                        Lo sentimos, no se puede encontrar la página.
                    </h2>
                    <p className="font-medium">
                        La página que estabas buscando parece haber sido movida, eliminada
                        o no existe.
                    </p>
                    <Link
                        to="/"
                        className="mt-7.5 inline-flex items-center gap-2 rounded-md bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90"
                    >
                        <IconLeftArrow />
                        <span>Volver al Inicio</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Error;