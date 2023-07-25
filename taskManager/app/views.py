from django.shortcuts import render,redirect 
from django.http import HttpResponse
from django.contrib.auth import authenticate,login as loginUser,logout
from django.contrib.auth.forms import UserCreationForm,AuthenticationForm  
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from app.serializers import TaskSerializer,UserSerializer,CommentSerializer
from app.models import Task,User,Comments
from app.forms import TaskForm
from app.models import Task
from django.contrib.auth.decorators import login_required
from rest_framework.exceptions import AuthenticationFailed
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
import jwt,datetime

# @login_required(login_url='login')
@api_view(["GET"])
def home(request):
    # if request.user.us_authenticated:
    #     user=request.user
    #     form=TaskForm() 
    #     tasks=Task.objects.filter(user=user)
    # # return render(request,'inde  x.html',contexty={'form':form})
    # # print('Hello World this is Home ')
    # return HttpResponse(f"Hello World This is from Http {tasks}")
    
    # token=request.COOKIES.get('jwt') 
    jwt_token= request.META.get('HTTP_AUTHORIZATION')
    print(jwt_token)
    if not jwt_token:
        return Response({
            "message":"UnAuthenticated",
            "status": 400
        })
        raise AuthenticationFailed("UnAuthenticated  !")
    token = jwt_token.split()[1]  
    print("Printing Token ",token)
    

    print("Token is there")
    try:
        
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({
            "message":"UnAuthenticated",
            "status": 400
        })
        raise AuthenticationFailed("UnAuthenticated")
    
    user_id = payload.get('id')  
    print("Printing User Id",user_id)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            "message":"User not found",
            "status": 400
        })
        raise AuthenticationFailed("User not found")
    serializer = UserSerializer(user)
    
    try:
        tasks=Task.objects.filter(Q(task_creator_id=user_id) | Q(user_id=user_id))
        
    except ObjectDoesNotExist:
        return Response({
            "message": "No Task Found",
            "success":400
        })

    serilizer=TaskSerializer(tasks,many=True)
    print(serilizer.data)
    return Response({
    "message":"All the Tasks Below",
    "status":200,
    "tasks":serilizer.data
    })

        
@api_view(["GET"])
def gettask(request,id):
    # if request.user.us_authenticated:
    #     user=request.user
    #     form=TaskForm() 
    #     tasks=Task.objects.filter(user=user)
    # # return render(request,'inde  x.html',contexty={'form':form})
    # # print('Hello World this is Home ')
    # return HttpResponse(f"Hello World This is from Http {tasks}")
    
    # token=request.COOKIES.get('jwt') 
    jwt_token= request.META.get('HTTP_AUTHORIZATION')
    print(jwt_token)
    if not jwt_token:
        return Response({
            "message":"UnAuthenticated",
            "status": 400
        })
        raise AuthenticationFailed("UnAuthenticated  !")
    token = jwt_token.split()[1]  
    print("Printing Token ",token)
    

    print("Token is there")
    try:
        
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({
            "message":"UnAuthenticated",
            "status": 400
        })
        raise AuthenticationFailed("UnAuthenticated")
    
    user_id = payload.get('id')  
    print("Printing User Id",user_id)
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            "message":"User not found",
            "status": 400
        })
        raise AuthenticationFailed("User not found")
    serializer = UserSerializer(user)
    
    try:
        task=Task.objects.get(id=id)   
    except ObjectDoesNotExist:
        return Response({
            "message": "No Task Found",
            "status":400
        })
    comments=Comments.objects.filter(task_id=id)
    if not task:
        return Response({
            "message": "No Task Found",
            "status":400
        })
    serilizer=TaskSerializer(task)
    comments_serializer = CommentSerializer(comments, many=True)
    print(serilizer.data)
    return Response({
    "message":"All the Tasks Below",
    "status":200,
    "tasks":serilizer.data,
    "comments": comments_serializer.data,
    "user_id":user_id
    })



@api_view(["POST"])
@csrf_exempt 
def signup(request):
    if request.method == 'POST':
        # print(request.POST)
        print(request.data)
        # print("request.data",dir(request))
        serializer=UserSerializer(data=request.data)
        # print(request)
        if serializer.is_valid():
            serializer.save()
            # user=form.save()
            # if user is not None:
                # return redirect('login',")
            return Response(serializer.data)
        else: 
            # context={
            #     "form":form
            # }
            # return render(request,signup.html,context=context)
            return Response({
            "message": "Form is Invalid",
            "status":400
            })
            return HttpResponse("Form is Invalid")
         
@api_view(["POST"])
@csrf_exempt 
def login(request):
    if request.method=="POST":
        # form=AuthenticationForm(data=request.POST)
        # if form.is_valid():
        #     username=form.cleaned_data.get('username')
        #     password=form.cleaned_data.get('password')
        #     user=authenticate(username=username,password=password)
        #     if user is not None:
        #         loginUser(request,user)
        #     print("Authenticated ",username)
        #     return HttpResponse(f"Login Successfull {username}")
        # else:
        #     HttpResponse("From is Not Valid")


        # print("Post Printtting     ",request.POST)
        # print("Data Printing       ",request.data)
        # return HttpResponse("Login Page returned Responce")

        # data=request.POST
        # email=request.POST['email']
        # password=request.POST['password']

        print(request.data)
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        print("printing Email & Password")
        print(email)
        print(password)
        print(User.objects.all())
        
        user=User.objects.filter(email=email).first()
        print("Printing User")
        print(user)
        if user is None:
            return Response({
            "message": "User Not Found---",
            "status":400
            })
            raise AuthenticationFailed("User Not Found---")

        if not user.check_password(password):
            return Response({
            "message": "Incorrect Password",
            "status":400
            })
            raise AuthenticationFailed(" Incorrect  Password")
        serializer = UserSerializer(user)  # Serialize the User object

        payload={
            'id':user.id,
            'exp':datetime.datetime.utcnow()+datetime.timedelta(minutes=60),
            'iat':datetime.datetime.utcnow() 
        }

        token = jwt.encode(payload, "secret", algorithm='HS256')

        response=Response()

        response.set_cookie(key='jwt',value=token,httponly=True)

        response.data={
            "message":"User Logined successfully",
            "status":200,
            "jwt":token 
        }
    return response
        
    
    # return Response(user)  

# @csrf_exempt 
# def add_task(request):
#     if request.user.is_authenticated:
#         user=request.user
#         print(user)
#         form =TaskForm(request.POST)
#         if form.is_valid():
#             print(form.cleaned_data)
#             task=form.save(commit=False)
#             task.user=user
#             task.save()
#             print(task)

#             allUserTasks=Task.objects.filter(user=user)
#             output=[]
#             for t in allUserTasks.values():
#                 output.append(t)
#             return HttpResponse(output)
        
    # return HttpResponse("Form is Invalid") 


@csrf_exempt
@api_view(["POST"])
def add_task(request):
    # if request.user.is_authenticated:
    #     user = request.user
    #     form = TaskForm(request.POST)
    #     if form.is_valid():
    #         task = form.save(commit=False)
    #         task.user = user
    #         task.save()

    #         allUserTasks = Task.objects.filter(user=user)
    #         serializer = TaskSerializer(data=allUserTasks, many=True)

            # if serializer.is_valid(raise_exception=False):
            #     print(serializer.data)
            #     return Response({},200)
            # return {}#Response({},404)

    # return Response("Form is Invalid")
    token=request.data.get('token')
    print(request.data)
    print("Printing Token ",token)
    if not token:
        return Response({
            "message": "UnAuthenticated  !",
            "status":400
            })
        raise AuthenticationFailed("UnAuthenticated  !")

    print("Token is there")
    try:
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({
            "message": "UnAuthenticated  !",
            "status":400
            })
        raise AuthenticationFailed("UnAuthenticated")
    
    user_id = payload.get('id')  
    # print("Printing User Id",user_id)
    # try:
    # user = User.objects.get(id=user_id)
    # except User.DoesNotExist:
    #     raise AuthenticationFailed("User not found")
    data=request.data

    data["status"]='P'
    data["task_creator"]=user_id
    data["task_assigned"]=None
    print("Printing Data")
    print(data)

    serializer = TaskSerializer(data=[data], many=True)
    print("=========")
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        print(serializer.errors)
        return Response({
            'message':'Data is Missing . Please Enter Properly',
            'status':400
        })




    serializer = UserSerializer(user)
    return Response(serializer.data)

@csrf_exempt
@api_view(["PUT"])
def assign_user(request,id):
    token=request.data.get('token')
    print("Printing Token ",token)
    if not token:
        raise AuthenticationFailed("UnAuthenticated  !")

    print("Token is there")
    try:
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("UnAuthenticated")
    
    user_id = payload.get('id')  
    # data["task_creator"]=user_id
    # data["task_assigned"]=None
   
    try:
        task=Task.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response({
            "message": "No Task Found",
            "status":400
        })
    data=request.data
    
    
    try:
        user=User.objects.get(email=data["email"])
    except ObjectDoesNotExist:
        return Response({
            "message": "No User Found For this email",
            "status":400
        })
    
    task.user=user
    task.save()
    return Response({
        "message": "User assigned to the task successfully.",
        "status":200
    })



@csrf_exempt
@api_view(["POST"])
def signout(request):
    response=Response()
    response.delete_cookie('jwt')
    response.data={
        'message':'Success',
        'status':200
    }
    return response

@csrf_exempt 
@api_view(["DELETE"])
def delete_task(request,id):
    jwt_token= request.META.get('HTTP_AUTHORIZATION')
    print(jwt_token)
    if not jwt_token:
        return Response({
            "message":"UnAuthenticated",
            "status": 400
        })
        raise AuthenticationFailed("UnAuthenticated  !")
    token = jwt_token.split()[1]  
    print("Printing Token ",token)
    if not token:
        return Response({
            'message':'UnAuthenticated',
            'success':400
        })
        raise AuthenticationFailed("UnAuthenticated  !")

    print("Token is there")
    try:
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({
            'message':'UnAuthenticated',
            'success':400
        })
        raise AuthenticationFailed("UnAuthenticated")
    
    user_id = payload.get('id')  
    print(id)
    try:
        task = Task.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response({
            "message": "Task ID not found.",
            "status":400
        })

    serilizer=TaskSerializer(task)
    print(serilizer.data)
    if serilizer.data['task_creator']==user_id:
        task.delete()
        return Response({
        "message":"Task Deleted Successfully",
        "status":200
        })
    return Response({
        "message":"Please Login From the posted user id .",
        "status":400
    })
    

@csrf_exempt 
@api_view(['PUT'])
def change_task(request,id):
    jwt_token= request.META.get('HTTP_AUTHORIZATION')
    print(jwt_token)
    if not jwt_token:
        return Response({
            "message":"UnAuthenticated",
            "status": 400
        })
        raise AuthenticationFailed("UnAuthenticated  !")
    token = jwt_token.split()[1]  
    print("Printing Token ",token)
    # token=request.data.get('jwt')
    # print("Printing Token ",token)
    # if not token:
    #     return Response({
    #         'message':'UnAuthenticated',
    #         'success':400
    #     })
    #     raise AuthenticationFailed("UnAuthenticated  !")

    print("Token is there",token)
    try:
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({
            'message':'UnAuthenticated',
            'success':400
        })
        raise AuthenticationFailed("UnAuthenticated")
    
    user_id = payload.get('id') 
    try:
        task=Task.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response({
            "message": "No Task Found",
            "status":400
        })
    # task=TaskSerializer(task)
    # print(task.data)
    print(user_id)
    print("hi")
    print(task.user_id)
    if  task.task_creator_id==user_id or task.user_id==user_id:
        if task.status == 'C':
            task.status = 'P'
        else:
            task.status = 'C'
        task.save()

        return Response({
            "data": {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "user": task.user_id,
                "date": task.date,
            },
            "message": "Task Updated Successfully",
            "status":200
        })
    else:
        return Response({
            "message":"You Don't have access to the Task",
            "status":400
        })
    
    # Save the updated task
    

    
    

@csrf_exempt 
@api_view(["DELETE"])
def delete_user(request):
    jwt_token= request.META.get('HTTP_AUTHORIZATION')
    print(jwt_token)
    if not jwt_token:
        return Response({
            "message":"UnAuthenticated",
            "status": 400
        })
        raise AuthenticationFailed("UnAuthenticated  !")
    token = jwt_token.split()[1]  
    print("Printing Token ",token)
    if not token:
        return Response({
            'message':'UnAuthenticated',
            'success':400
        })
        raise AuthenticationFailed("UnAuthenticated  !")

    print("Token is there")
    try:
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({
            'message':'UnAuthenticated',
            'success':400
        })
        raise AuthenticationFailed("UnAuthenticated")
    
    user_id = payload.get('id') 
    user=User.objects.get(id=user_id).delete()
    return Response({
        "message":"User Deleted Successfully"
    })


@csrf_exempt 
@api_view(["POST"])
def add_comment(request,id):
    token=request.data.get('token')
    print("Printing Token ",token)
    if not token:
        return Response({
            'message':'UnAuthenticated',
            'success':400
        })
        raise AuthenticationFailed("UnAuthenticated  !")

    print("Token is there")
    try:
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({
            'message':'UnAuthenticated',
            'success':400
        })
        raise AuthenticationFailed("UnAuthenticated")
    
    user_id = payload.get('id') 
    print(id)
   
    try:
        task=Task.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response({
            "message": "No Task Found",
            "status":400
        })
    
    if task.task_creator_id==user_id or task.user_id==user_id:
        data=request.data
        data["user_id"]=user_id
        data["task_id"]=id
        user=User.objects.get(id=user_id)
        data["user_name"]=user.name
        # print("Printing User")
        # print(user.name)
        serializer = CommentSerializer(data=[data], many=True)
        print("=========")
        if serializer.is_valid():
            serializer.save()
            data=serializer.data
            # print(user.name)
            # data[0]["name"]=user.name
            # print(type(data))
            serializer_data = serializer.data # get the default serialized data 
            # serializer_data.append({"user_name": user.name})
            return Response(serializer_data)
        else:
            print(serializer.errors)
            return Response({
                'message':'Data is Missing . Please Enter Properly',
                'status':400
            })
    else:
        return Response({
            "message":"You don't have access to this task",
            'status':400
        })


@csrf_exempt 
@api_view(["DELETE"])
def delete_comment(request,id):
    jwt_token= request.META.get('HTTP_AUTHORIZATION')
    print(jwt_token)
    if not jwt_token:
        return Response({
            "message":"UnAuthenticated",
            "status": 400
        })
        raise AuthenticationFailed("UnAuthenticated  !")
    token = jwt_token.split()[1]  
    print("Printing Token ",token)
    if not token:
        return Response({
            'message':'UnAuthenticated',
            'status':400
        })
        raise AuthenticationFailed("UnAuthenticated  !")

    print("Token is there")
    try:
        payload=jwt.decode(token,'secret',algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response({
            'message':'UnAuthenticated',
            'status,':400
        })
        raise AuthenticationFailed("UnAuthenticated")
    
    user_id = payload.get('id')  
    print(id)


    try:
        comment= Comments.objects.get(id=id)
    except ObjectDoesNotExist:
        return Response({
            "message": "Comment ID not found.",
            "status":400
        })
    if comment.task_id.task_creator_id==user_id:
        comment.delete()
        return Response({
        "message":"Comment Deleted Successfully",
        "status":200
        })
    serilizer=CommentSerializer(comment)
    print(serilizer.data)
    if serilizer.data['user_id']==user_id:
        comment.delete()
        return Response({
        "message":"Comment Deleted Successfully",
        'status':200
        })
    return Response({
        "message":"Please Login From the posted user id .",
        "status":400
    })