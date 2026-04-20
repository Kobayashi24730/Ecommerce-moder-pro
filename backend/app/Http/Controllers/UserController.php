<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Password;

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
                'email' => 'required|email|uiques:users',
                'password' => 'required|min:8|confirmed'
            ]);
            $users = User::create([
                'name' => $request->nome,
                'email' => $request->email,
                'password' => $request->password
            ], 200);
            return response()->json([
                'message' => 'Usuario cadastrado com sucesso!',
                'data' => $users
            ]);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Falha ao cadastrar usuario!',
                'data' => $ex
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
                'email' => 'required|email|uiques:users',
                'passwordNova' => 'required|min:8|confirmed'
            ]);
            $user = User::crete([
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
                $request->only('token', 'email', 'password_confirmed', 'token'),
                function ($user, $password) use ($request) {
                    $user->forceFill([
                        'password' => $request->password
                    ]);
                }
            );

            return response()->json([
                'message' => 'Senha alterada com sucesso!',
                'data' => $status
            ]);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => 'Falha ao alterar senha!',
                'data' => $ex
            ]);
        }
    }
}
