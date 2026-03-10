import DreamJob from "../Components/LandingPage/DreamJob";
import Companies from "../Components/LandingPage/Companies";
import JobCategory from "../Components/LandingPage/JobCategory";
import Working from "../Components/LandingPage/Working";
import Testimonials from "../Components/LandingPage/Testimonials";
import Subscribe from "../Components/LandingPage/Subscribe";


const HomePage=()=>{
    return (
        <div className="min-h-[90vh] bg-white">
     <DreamJob />
     <JobCategory />
         <Working />
         <Testimonials />
         <Companies />
         <Subscribe />
        </div>
    )
}
export default HomePage;