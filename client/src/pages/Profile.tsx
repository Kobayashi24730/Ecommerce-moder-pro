import { useAuth } from "@/contexts/AuthContext";

export default function Profile(){
    const { user } = useAuth();
    return(
        <div>
            <h1>{user.name}</h1>
        </div>
    );
}