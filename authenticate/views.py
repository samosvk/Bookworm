from django.shortcuts import render
from rest_framework import generics
from .serializers import UserRegisterSerializer, UserLoginSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import login
from django.views.decorators.csrf import csrf_exempt

class RegistrationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer
    #handle post request submitted when someone presses submit
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data['password']) #hash the password
            user.save() #save the user with hashed password
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            #log the user in
            login(request, user)
            return Response({'message': 'Login Successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
                
