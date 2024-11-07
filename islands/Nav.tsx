import { useEffect, useRef, useState } from "preact/hooks";
import { asset } from "$fresh/runtime.ts";

const Nav = () => {
    const ref = useRef(window);
    const [navOpen, setNavOpen] = useState(false);
    const LINK_STYLE = "block mt-4 md:inline-block md:mt-0 hover:text-white";
    const NAV_STYLE =
        "w-full block flex-grow md:flex md:items-center md:w-auto";
    const NAV_LINKS_STYLE = "text-sm md:flex-grow";
    const BUTTON_STYLE =
        "inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:bg-yellow-400 mt-4 md:mt-0";

    useEffect(() => {
        let lastKnownWidth = 0;
        let ticking = false;

        const doSomething = (width) => {
            if (width > 768) {
                setNavOpen(true);
            } else {
                setNavOpen(false);
            }
        };

        const onResize = (e) => {
            lastKnownWidth = ref.current.innerWidth;
            if (!ticking) {
                ref.current.requestAnimationFrame(() => {
                    doSomething(lastKnownWidth);
                    ticking = false;
                });
                ticking = true;
            }
        };

        doSomething(ref.current.innerWidth);
        ref.current.addEventListener("resize", onResize);
        return () => {
            ref.current.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div className="bg-green-600">
            <nav className="flex items-center justify-between flex-wrap p-6 max-w-screen-md mx-auto">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <a href="/">
                        <img
                            src={asset("/logo.svg")}
                            width={30}
                            alt="the fresh logo: a sliced lemon dripping with juice"
                        />
                    </a>
                    <a href="/">
                        <span className="font-semibold text-xl tracking-tight">
                            オフィスザウルス(仮)
                        </span>
                    </a>
                </div>
                <div className="block md:hidden">
                    <button
                        className="flex items-center px-3 py-2 border rounded text-white hover:border-yellow-400 hover:bg-yellow-400 focus:outline-none"
                        onClick={() => {
                            setNavOpen(!navOpen);
                        }}
                    >
                        <svg
                            className="fill-current h-3 w-3"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>
                {navOpen && (
                    <div className={NAV_STYLE}>
                        <div className={NAV_LINKS_STYLE}>
                            <a href="/login" className={`${BUTTON_STYLE} mr-4`}>
                                Login
                            </a>
                            <a
                                href="/logout"
                                className={`${BUTTON_STYLE} mr-4`}
                            >
                                Logout
                            </a>
                            <a href="/account" className={BUTTON_STYLE}>
                                Account
                            </a>
                        </div>
                        <div>
                            <a href="/signup" className={BUTTON_STYLE}>
                                Signup
                            </a>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Nav;