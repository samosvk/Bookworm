from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True},
        }
    def validate(self, data):
        super().validate(data)
        password, username = data.get('password'), data.get('username')
        #check if passwords match
        if password != data.pop('confirm_password'):
            raise serializers.ValidationError('Passwords do not match')
        #check lengths of passwords and username
        min_password_length, max_password_length = 5, 30
        max_user_length = 30
        if len(password) < min_password_length:
            raise serializers.ValidationError(
                f"Password must be at least {min_password_length} characters long."
            )
        elif len(password) > max_password_length:
            raise serializers.ValidationError(
                f"Password must be at most {max_password_length} characters long."
            )
        max_username_length = 30  # Maximum username length
        if len(username) > max_username_length:
            raise serializers.ValidationError(
                f"Username must be at most {max_username_length} characters long."
            )
        return data



class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        #make sure fields are not empty
        if username and password:
            user = authenticate(username=username, password=password)
            #check if user exists, then return user data for login
            if user:
                data['user'] = user
            else:
                raise serializers.ValidationError("Incorrect username or password")
        else:
            raise serializers.ValidationError("Must include 'username' and 'password'")
        return data