# Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file
# except in compliance with the License. A copy of the License is located at
#
#     http://aws.amazon.com/apache2.0/
#
# or in the "license" file accompanying this file. This file is distributed on an "AS IS"
# BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations under the License.
"""
A BitBucket Builds template for deploying an application revision to AWS CodeDeploy
narshiva@amazon.com
v1.0.0
"""
from __future__ import print_function
import os
import sys
import shutil
import distutils.dir_util
from time import strftime, sleep
import boto3
import mimetypes
from botocore.exceptions import ClientError

APPLICATION_NAME        = 'Sociami'
DEPLOYMENT_CONFIG       = 'CodeDeployDefault.OneAtATime'
PRD_S3_BUCKET           = 'soqqle.com'
DEV_S3_BUCKET           = 'stg.soqqle.com'
AWS_ACCESS_KEY_ID = 'AKIAJQTXVEWBQJYDATVQ'
AWS_SECRET_ACCESS_KEY = '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'
AWS_DEFAULT_REGION = 'ap-southeast-1'
VERSION_LABEL = strftime("%Y%m%d%H%M%S")
BUCKET_KEY = APPLICATION_NAME + '/' + VERSION_LABEL + \
    '-bitbucket_builds.zip'

build_path = 'dist'
zip_path = 'tmp/artifact'

def upload_to_s3(artifact):
    """
    Uploads an artifact to Amazon S3
    """
    try:
        client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region=AWS_DEFAULT_REGION
        )
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False
    try:
        client.put_object(
            Body=open(artifact, 'rb'),
            Bucket=S3_BUCKET,
            Key=BUCKET_KEY
        )
    except ClientError as err:
        print("Failed to upload artifact to S3.\n" + str(err))
        return False
    except IOError as err:
        print("Failed to access artifact.zip in this directory.\n" + str(err))
        return False
    return True

def deploy_new_revision(env):
    """
    Deploy a new application revision to AWS CodeDeploy Deployment Group
    """
    try:
        client = boto3.client(
            'codedeploy',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    try:
        response = client.create_deployment(
            applicationName=APPLICATION_NAME,
            deploymentGroupName=env,
            revision={
                'revisionType': 'S3',
                's3Location': {
                    'bucket': S3_BUCKET,
                    'key': BUCKET_KEY,
                    'bundleType': 'zip'
                }
            },
            deploymentConfigName=DEPLOYMENT_CONFIG,
            description='New deployment from local dev machine',
            ignoreApplicationStopFailures=True
        )
    except ClientError as err:
        print("Failed to deploy application revision.\n" + str(err))
        return False     
           
    """
    Wait for deployment to complete
    """
    while 1:
        try:
            deploymentResponse = client.get_deployment(
                deploymentId=str(response['deploymentId'])
            )
            deploymentStatus=deploymentResponse['deploymentInfo']['status']
            if deploymentStatus == 'Succeeded':
                print ("Deployment Succeeded")
                return True
            elif (deploymentStatus == 'Failed') or (deploymentStatus == 'Stopped') :
                print ("Deployment Failed. Please check AWS CodeDeploy for more detailed.")
                return False
            elif (deploymentStatus == 'InProgress') or (deploymentStatus == 'Queued') or (deploymentStatus == 'Created'):
                continue
        except ClientError as err:
            print("Failed to deploy application revision.\n" + str(err))
            return False      
    return True

def upload_folder_to_s3_recursively (folder, bucket):
    try:
        client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )
    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    for root, dirs, files in os.walk(folder):
        for filename in files:
            # construct the full local path
            local_path = os.path.join(root, filename)

            # construct the full Dropbox path
            relative_path =os.path.relpath(local_path, folder)
            # s3_path = os.path.join("/", relative_path)

            print('Searching "%s" in "%s"' % (relative_path, bucket))
            try:
                print("Uploading %s..." % relative_path)
                client.put_object(
                    Body=open(local_path, 'rb'),
                    Bucket=bucket,
                    Key=relative_path,
                    ContentType=get_mimetype(local_path)
                )
            except ClientError as err:
                print ("Cannot upload %s..." % relative_path)
                print("Error: " + str(err))
                return False
    return True

def get_mimetype(filename):
    file_ext = filename[filename.rfind('.'):]
    if file_ext in mimetypes.types_map:
        return mimetypes.types_map[file_ext]
    else:
        return ""

def copy_deployment_script(build_path):
    shutil.copyfile('appspec2.yml', build_path + '/appspec.yml')
    distutils.dir_util.copy_tree('scripts2', build_path +'/scripts')

def compress_artifact(build_path):
    return shutil.make_archive(zip_path, 'zip', build_path)

def validate_command():
    """
    get the deployment environment name input from command line.
    """
    if (len(sys.argv) <2):
        print("Please specify environemnt to deploy.\n" +\
        "Example:\n" +\
        "\tpython deploy.py Staging")
        sys.exit(1)
    if not sys.argv[1] in ['Staging', 'Production']:
        print("The environment is not correct, please specify the correct environment to deploy. \n[Staging, Production]")
        sys.exit(1)

def main():
    validate_command()
    environemnt = sys.argv[1]
    # copy_deployment_script(build_path);
    # zipped_artifact = compress_artifact(build_path)
    # print("Start uploading...");
    # if not upload_to_s3(zipped_artifact):
    #     sys.exit(1)
    # print("Upload sucessfully.\n");
    # print("Start deploying...");
    # if not deploy_new_revision(environemnt):
    #     sys.exit(1)

    print("Start uploading to S3...")
    result = False
    if environemnt == 'Production':
        result = upload_folder_to_s3_recursively(build_path, PRD_S3_BUCKET)
        print("Production domain is being used for 'coming soon' page. Please deploy to staging environment instead.")
    else:
        result = upload_folder_to_s3_recursively(build_path, DEV_S3_BUCKET)

    if result:
        print("Uploaded successfully.")
    else:
        print("Upload has not succeeded.")

if __name__ == "__main__":
    main()
