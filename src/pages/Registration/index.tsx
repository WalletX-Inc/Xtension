import { useState } from "react";
import Button from "../../components/common/Button";
import icon128 from "../../assets/icons/mainLogo.png";
import Register from "./Register";
import { ArrowRightCircle } from "react-feather";
import { useConfig } from "../../context/ConfigProvider";
import toast from "react-hot-toast";
import { getItemFromStorage } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

function Registration() {
  const [showRegister, setShowRegister] = useState(false);

  const navigate = useNavigate();

  const smartAddress = getItemFromStorage("smartAccount");

  const handleRemoveData = (id: string) => {
    localStorage.clear();
    setShowRegister(true);
    toast.dismiss(id);
  };

  return (
    <div>
      <img src={icon128} alt="logo" className="w-40  h-36 m-auto mt-12" />
      <h1 className="font-bold  text-center text-2xl m-auto">Wallet X</h1>

      {showRegister ? (
        <Register />
      ) : (
        <Button
          className="min-w-[300px] mt-[150px] text-white bg-gray-900 border hover:bg-gray-950 rounded-3xl flex justify-center m-auto
        transition duration-500 hover:scale-110 p-2"
          onClick={() => {
            if (smartAddress) {
              toast(
                (t) => (
                  <div
                    style={{
                      opacity: t.visible ? 1 : 0,
                      transition: "opacity 100ms ease-in-out",
                      color: "white",
                    }}
                  >
                    <div>
                      <h4>
                        An account with username already Exist !! <br />
                        Do you still need to create one? It will erase previous
                        account data
                      </h4>
                      <div className="flex justify-between align-center max-w-md">
                        <Button onClick={() => handleRemoveData(t.id)}>
                          Yes
                        </Button>
                        <Button
                          onClick={() => {
                            toast.dismiss(t.id);
                            navigate("/login");
                          }}
                        >
                          No
                        </Button>
                      </div>
                    </div>{" "}
                  </div>
                ),
                {
                  duration: 30 * 1000,
                }
              );
            } else {
              setShowRegister(true);
            }
          }}
        >
          <div className="p-2 flex justify-between items-center gap-5 font-bold">
            Create new wallet <ArrowRightCircle />{" "}
          </div>
        </Button>
      )}
    </div>
  );
}

export default Registration;
