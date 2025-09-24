
import { Header } from "@/widgets/header"
import { Profile } from "@/widgets/profile"
import { Outlet } from "react-router-dom"


export const AppLayout = () => {
  
  return (
    <>
    <Header profile={<Profile/>}/>
    <Outlet/>
    {/* <h2>Footer</h2> */}
    </>
  )
}
