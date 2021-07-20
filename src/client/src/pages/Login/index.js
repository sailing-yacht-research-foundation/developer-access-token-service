import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as authactions from '../../store/actions/auth';
import { useState } from 'react';
import TextBox from '../../components/TextBox';
import Button from '../../components/Button';
const Login = ({ login }) => {
  const [form, setForm] = useState({
    access_token: '',
    message: '',
  });

  const onChange = (evt) => {
    setForm({
      ...form,
      [evt.target.name]: evt.target.value,
    });
  };
  let history = useHistory();
  const onSignin = () => {
    login(form)
      .then((data) => {
        if (data.id) {
          history.push('/');
        } else {
          setForm({
            ...form,
            message: data.message,
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          setForm({ ...form, message: err.response.data.message });
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 w-full">
            Developer Access Token Admin
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />
          <h2 className="font-semibold text-red-700 text-center">
            {form.message}
          </h2>
          <div className="rounded-md shadow-sm -space-y-px">
            <TextBox
              label="Access Token"
              groupclass="mb-2"
              placeholder="Put your access token here"
              value={form.user}
              changed={onChange}
              name="access_token"
              type="text"
            />
          </div>

          <div>
            <Button className="w-full" clicked={() => onSignin()}>
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (data) => dispatch(authactions.login(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
