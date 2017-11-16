classdef SurfVect
    %UNTITLED Summary of this class goes here
    %   Detailed explanation goes here
    
    properties 
        x;
        y;
        z;
    end
    
    properties (Dependent)
        dxu;
        dyu;
        dzu;
        dzv;
        dyv;
        dxv;
    end
    
    methods
        function obj = SurfVect(varargin)
            syms u v
            if (nargin == 3)
                obj.x = varargin{1};
                obj.y = varargin{2};
                obj.z = varargin{3};
            elseif (nargin == 1)
                f = subs(varargin{1},u);
                obj.x = u;
                obj.y = f*cos(v);
                obj.z = f*sin(v);
            end
        end
         
        function plot(obj)
            fsurf(obj.x,obj.y,obj.z);
        end
        
        function dxu = get.dxu(obj)
            dxu = diff(obj.x);
        end
           
        function dyu = get.dyu(obj)
            dyu = diff(obj.y);
        end
        
        function dzu = get.dzu(obj)
            dzu = diff(obj.z);
        end
        
        function dxv = get.dxv(obj)
            dxv = diff(obj.x);
        end
           
        function dyv = get.dyv(obj)
            dyv = diff(obj.y);
        end
        
        function dzv = get.dzv(obj)
            dzv = diff(obj.z);
        end
        
        function r = u(obj)
            syms t
            r(t) = [obj.x(t,0),obj.y(t,0),obj.z(t,0)];
        end
        
    end
    
end

