
import React from "react";
import HeaderMain from "@/components/elements/header/HeaderMain";
import Bento from "@/components/elements/main/Bento";
import Team from "@/components/elements/main/Team";
import Articles from "@/components/elements/main/Articles";


export default function Home() {

    return (
        <>
            <HeaderMain/>
            <Bento/>
            <Team/>
            <Articles/>
        </>
    );
}
