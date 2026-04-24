<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:8'
            ]);
            $users = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);
            return response()->json([
                'message' => 'Usuario cadastrado com sucesso!',
                'data' => $users
            ], 201);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Falha ao cadastrar usuario!',
                'data' => $ex->getMessage()
            ],404);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $users = User::findOrFail($id);
            return response()->json($users, 200);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Falha ao busca usuario!'
            ],404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $request->validate([
                'nome' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'passwordNova' => 'required|min:8|confirmed'
            ]);
            $user = User::create([
                'name' => $request->nome,
                'email' => $request->email,
                'password' => bcrypt($request->passwordNova)
            ]);
            return response()->json([
                'message' => 'Usuario atualizado com sucesso!',
                'data' => $user
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Falha ao atualizar usuario!',
                'data' => $ex
            ], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = User::findorFail($id);
            $user->delete();
            return response()->json([
                'message' => 'Usuario deletado com sucesso!'
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Falha ao deletar usuario!'
            ], 404);
        }
    }



    public function forgot_password(Request $request){
        try {
            $request->validate([
                'email' => 'required|email',
            ]);
            $status = Password::sendResetLink ( $request->only('email'));
            if ($status == Password::RESET_LINK_SENT){
                return response()->json([
                    'message' => 'Email enviado com sucesso!',
                    'data' => $status
                ], 202);
            }
            return response()->json([
                'message' => 'Email nao enviado!',
                'data' => $status
            ]);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Falha ao enviar email!',
                'data' => $ex->getMessage()
            ], 404);
        }
    }


    public function reset_password(Request $request){
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed'
            ]);
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) use ($request) {
                    $user->forceFill([
                        'password' => $request->password
                    ])->setRememberToken(Str::random(50));
                    $user->save();
                }
            );

            if($status == Password::PASSWORD_RESET){
                return response()->json([
                    'message' => 'Senha alterada com sucesso!',
                    'data' => $status
                ], 202);
            }
            return response()->json([
                'message' => 'Erro ao redefinir senha!',
                'data' => $status
            ], 400);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Falha ao alterar senha!',
                'data' => $ex->getMessage()
            ]);
        }
    }

    public function login(Request $request){
        try {
            $friends = $request->validate([
                'email' => 'required|email',
                'password' => 'required|min:8'
            ]);

            if(!Auth::attempt($friends)){
                return response()->json([
                    'message' => 'Email ou senha invalidos!'
                ], 401);
            }

            /** @var \App\Models\User $user */
            $user = Auth::user();
            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;
            $cookie = cookie(
                'jwt_token',
                $token,
                60 * 24,
                "/",
                null,
                false,
                true,
                false,
                'Lax'
            );
            return response()->json([ 'message' => 'Logado com sucesso!', 'token' => $token, 'user' => $user ])->withCookie($cookie);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([ 'errors' => $e->errors()], 422);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Falha ao logar!',
                'data' => $ex->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request){
        $request->user()->currentAccessToken()?->delete();
        return response()->json([ 'message' => 'Deslogado com sucesso!' ]);
    }

    public function me(){
        $user = Auth::user();
        if(!$user){
            return response()->json([ 'message' => 'Usuario nao autenticado!' ]);
        }
        return response()->json(null);
    }
}
