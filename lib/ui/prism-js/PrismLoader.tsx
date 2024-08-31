"use client";

import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
// @ts-ignore
import "prismjs/components/prism-typescript";
// @ts-ignore
import "prismjs/components/prism-regex";
// @ts-ignore
import "prismjs/components/prism-json";
// @ts-ignore
// import "prismjs/components/prism-tsx";

export default function PrismLoader() {
	useEffect(() => {
		Prism.highlightAll();
	}, []);

	return <div className="hidden"></div>;
}
