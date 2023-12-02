import icon128 from "../../assets/icons/mainLogo.png";

export default function SignatureRequest() {
  return (
    <>
      <div className="container mx-auto">
        <div className="rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center">
            WalletX Signature Request
          </h2>
          <img src={icon128} alt="WalletX" className="h-16 m-auto my-8" />
          <h2 className="text-xl text-center mb-2">Signature Request</h2>
          <p className="text-center mb-3">
            Only sign this message if you fully understand the content and trust
            the requesting site.
          </p>
          <hr className="my-2"/>
          <p className="text-center text-lg font-bold">You are signing:</p>
          <div className="bg-gray-500 my-3 text-center rounded-lg">
            <h4>Message</h4>
            <pre className="text-center overflow-auto rounded-md p-3">
              Example `personal_sign` message
            </pre>
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="w-1/2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg flex justify-center m-auto
          transition duration-500 hover:scale-110 p-2"
            >
              Sign
            </button>
            <button className="w-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-4">
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
