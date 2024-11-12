import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Track() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = (data) => {
    const awbNumber = data.awbNumber;
    navigate("/TrackingDetails",{ state: { awbNumber } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)} // React Hook Form prevents refresh here
        className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full"
      >
        <div className="flex flex-col items-center">
          <img
            src="/Track-icon.svg"
            alt="Track Icon"
            className="w-12 h-12 mb-4"
          />
          <label
            htmlFor="awbNumber"
            className="text-lg font-medium text-gray-700"
          >
            Enter AWB Number
          </label>
        </div>
        <input
          type="text"
          id="awbNumber"
          placeholder="Enter AWB Number"
          {...register("awbNumber", {
            required: "AWB Number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "AWB Number must be a number",
            },
            minLength: {
              value: 4,
              message: "AWB Number must be exactly 4 digits",
            },
            maxLength: {
              value: 4,
              message: "AWB Number must be exactly 4 digits",
            },
          })}
          className={`mt-4 w-full px-4 py-2 border rounded-lg focus:outline-none ${
            errors.awbNumber
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-purple-500"
          }`}
        />
        {errors.awbNumber && (
          <p className="mt-2 text-sm text-red-500">
            {errors.awbNumber.message}
          </p>
        )}
        <button
          type="submit"
          className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300"
        >
          Track
        </button>
      </form>
    </div>
  );
}

export default Track;
