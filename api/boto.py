import boto3
import sys, os
from os import listdir
from os.path import isfile, join
from botocore.client import ClientError

# Shortening the ec2 command, nothing special
ec2 = boto3.resource('ec2')
client = boto3.client('ec2')

def usage_message():
    print "This script communicates with aws buckets!"
    print "Please ensure the first argument is either -up for uploads or -down for downloads"
    exit()

def up_usage_message():
    print "This script allows you to upload files to the aws buckets!"
    print "Usage: python boto.py -up [-f=<file to upload>][-b=<bucket name>] optional: [-s=bucket folder]"
    exit()

def down_usage_message():
    print "This script allows you to download files from the aws buckets!"
    print "Usage: python boto.py -down [-f=<file/folder to download>][-b=<bucket name>][-l=<local destination>]"
    prompt = raw_input('Would you like an example, type y or n: ')
    if prompt == "y":
        print "Example: 'python boto.py -down imagedataset/beach/0.jpg imagedataset images/0.jpg' will save the first image in the beach folder from the imagedataset bucket to a file called 0.jpg in the directory images within your current working directory"
    exit()

# Uploading function
def upload(pathname, bucket, sub_bucket):
    # Confirm file or directory path exists/check if directory
    if os.path.isfile(pathname):
        print "Uploading file " + pathname
        directory = False
    elif os.path.isdir(pathname):
        print "Uploading directory " + pathname
        directory = True
    else:
        print "Sorry, I couldn't find that file or directory"
        os._exit(1)
    # Confirm bucket exists
    bucket = s3.Bucket(bucket)
    print "Now accessing bucket "+bucket.name
    exists = True
    try:
        s3.meta.client.head_bucket(Bucket=bucket.name)
        print "Bucket found!"
    except ClientError:
        # The bucket does not exist or you have no access
        print "Bucket not found"
        os._exit(2)
    # If dirctory, get a list of files (can't do nested directories yet)
    if directory:
        files = [f for f in listdir(pathname) if isfile(join(pathname, f))]
        print "\nIncluding files:"
        for item in files:
            print item
    else:
        files[0] = pathname
    # Begin actual upload
    for item in files:
        if directory:
            name = pathname+"/"+item
        elif sub_bucket != False:
            name = sub_bucket+"/"+item
        else:
            name = item
        print "Now uploading "+name
        data = open(name, 'rb')
        s3.Bucket(bucket.name).put_object(Key=name, Body=data)
    print "Uploading complete!"

# CLI Downloading function
def download(bucket, filename, dest):
    # Confirm file or directory path exists/check if directory
    tmp = dest.split("/")
    dir_path = ""
    for i in range(len(tmp)-1):
        dir_path = dir_path+tmp[i]+"/"
    if os.path.isdir(dir_path):
        print "Saving file to "+dir_path
    else:
        print "Sorry, I couldn't find the destination "+dir_path
        prompt = raw_input('Would you like to create this destination, type y or n: ')
        if prompt == "y":
            os.makedirs(dir_path)
            print "Downloading to "+dir_path
        else:
            print "Program terminating"
            os._exit(1)
    # Confirm bucket exists
    bucket = s3.Bucket(bucket)
    print "Now accessing bucket "+bucket.name
    exists = True
    try:
        s3.meta.client.head_bucket(Bucket=bucket.name)
        print "Bucket found!"
    except ClientError:
        # The bucket does not exist or you have no access.
        print "Bucket not found"
        os._exit(2)
    # Check if target file or folder is in bucket
    target = filename[len(bucket.name)+1:]
    try:
        s3.Object(bucket.name, target).get()
    except ClientError:
        print "Target "+target+" not found"
        os._exit(3)
    else:
        print "Target "+target+" found, download in progress"
    # Download the file to destination
    s3.meta.client.download_file(bucket.name, target, dest)
    print "File download complete!"

# pipeline downloading function
def download_in(bucket, foldername):
    # Confirm dest directory exists
    dest = "images/"+foldername
    if not(os.path.isdir(dest)):
        os.makedirs(dest)
    # Confirm bucket exists
    bucket = s3.Bucket(bucket)
    exists = True
    try:
        s3.meta.client.head_bucket(Bucket=bucket.name)
    except ClientError:
        # The bucket does not exist or you have no access.
        print "Bucket not found"
        os._exit(0)
    prefix = foldername+"/"
    items = []
    for obj in bucket.objects.filter(Prefix=prefix):
        items.append(obj)
        target = obj.key
        try:
            s3.Object(bucket.name, target).get()
        except ClientError:
            print "Target "+target+" not found"
            # The target is unidentified
            os._exit(1)
        s3.meta.client.download_file(bucket.name, target, "images/"+target)
    print "File download complete!"

if __name__ == "__main__":

# Get inputs
    args = sys.argv[1:]
    method = args[0]
    if method == "-down":
        if len(args) != 4:
            down_usage_message()
        else:
            pathname = args[1]
            bucket = args[2]
            dest = args[3]
    elif method == "-up":
        if len(args) < 3:
            down_usage_message()
        elif len(args) == 4:
            pathname = args[1]
            bucket = args[2]
            sub_bucket = args[3]
        else:
            pathname = args[1]
            bucket = args[2]
            sub_bucket = False
    elif method == "-down_in":
        if len(args) == 3:
            bucket = args[1]
            folder = args[2]
    else:
        usage_message()

# Choosing which to run
    if method == "-down":
        print "Downloading beginning"
        download(bucket, pathname, dest)
    elif method == "-up":
        print "Uploading beginning"
        upload(pathname, bucket, sub_bucket)
    elif method == "-down_in":
        print "Downloading beginning"
        download_in(bucket, folder)
    else:
        print "No correct method found, exiting program"
        exit()
