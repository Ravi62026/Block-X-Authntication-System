import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  AnonAadhaarProof,
} from "@anon-aadhaar/react";
import { useState } from "react";
import { useAccount } from "wagmi";

import "./checkbox.css";

export default function Home() {
  const { address } = useAccount();
  const [anonAadhaar] = useAnonAadhaar();
  const [fields, setFields] = useState({
    revealAgeAbove18: false,
    revealGender: false,
    revealPinCode: false,
    revealState: false,
  });
  type FieldKey =
    | "revealAgeAbove18"
    | "revealGender"
    | "revealPinCode"
    | "revealState";

  const fieldsToReveal = (): FieldKey[] => {
    const fieldsToReveal: FieldKey[] = [];
    if (fields.revealAgeAbove18) fieldsToReveal.push("revealAgeAbove18");
    if (fields.revealGender) fieldsToReveal.push("revealGender");
    if (fields.revealPinCode) fieldsToReveal.push("revealPinCode");
    if (fields.revealState) fieldsToReveal.push("revealState");
    return fieldsToReveal;
  };

  const dataMapping = {
    revealAgeAbove18: "ageAbove18",
    revealGender: "gender",
    revealPinCode: "pinCode",
    revealState: "state",
  };

  return (
    <div className="container">
      {/* Floating Text for "Ravi Shankar" */}
      <div className="floating-text">
        Ravi Shankar
      </div>

      <div className="section">
        <h2 className="section-title">Select Data to Share</h2>

        <div className="checkbox-group">
          {[{ label: "Age above 18", field: "revealAgeAbove18", color: "yellow" },
            { label: "Gender", field: "revealGender", color: "pink" },
            { label: "Pin Code", field: "revealPinCode", color: "blue" },
            { label: "State", field: "revealState", color: "orange" },
          ].map(({ label, field, color }) => (
            <div key={field} className="checkbox-item">
              <label className="switch">
                <input
                  type="checkbox"
                  className={`toggle toggle-${color}`}
                  onChange={() =>
                    setFields({
                      ...fields,
                      [field]: !fields[field],
                    })
                  }
                />
                <span className="slider "></span>
              </label>
              <div>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-section">
        <h2 className="auth-title">
          Verify your identity using Anon Aadhaar
        </h2>
        <LogInWithAnonAadhaar
          nullifierSeed={1234}
          fieldsToReveal={fieldsToReveal()}
          signal={address}
        />
        <div className="status">
          Status :{" "}
          <span
            className={`status-text ${
              anonAadhaar?.status === "logged-out"
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {anonAadhaar?.status}
          </span>
        </div>
      </div>

      {anonAadhaar?.status === "logged-in" && (
        <div className="proof-section">
          <h2 className="proof-title">✅ Your Proof is Valid</h2>
          <AnonAadhaarProof
            code={JSON.stringify(anonAadhaar.anonAadhaarProofs, null, 2)}
            label="- Anon Aadhaar Proof"
          />
          <div className="proof-details">
            <h1>Fetched Details from ZK proof</h1>
            {Object.keys(fields).map((item) => {
              const key = item as FieldKey;
              if (fields[key]) {
                const proofData = JSON.parse(
                  anonAadhaar.anonAadhaarProofs["0"].pcd
                ).proof;
                let displayValue;

                if (dataMapping[key] === "gender") {
                  displayValue = String.fromCharCode(proofData?.[dataMapping[key]]);
                } else if (dataMapping[key] === "ageAbove18") {
                  displayValue =
                    proofData?.[dataMapping[key]] === "1"
                      ? "Above 18"
                      : "Below 18";
                } else if (dataMapping[key] === "state") {
                  let encodedNumber = proofData?.[dataMapping[key]];
                  if (typeof encodedNumber === "string") {
                    encodedNumber = Number(encodedNumber);
                  }
                  if (!isNaN(encodedNumber)) {
                    const hexString = encodedNumber.toString(16);
                    try {
                      const decodedText = Buffer.from(
                        hexString,
                        "hex"
                      ).toString("utf-8");
                      displayValue = decodedText.split("").reverse().join("");
                    } catch (error) {
                      console.error("Error decoding hex string:", error);
                    }
                  }
                } else if (dataMapping[key] === "pinCode") {
                  displayValue = proofData?.pincode;
                }

                return (
                  <p key={key} className="proof-detail">
                    {dataMapping[key]}: {displayValue}
                  </p>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
